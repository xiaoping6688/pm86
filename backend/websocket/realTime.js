/* jshint node: true */
'use strict';

const $ = require('../helpers');

const config        = $.config;
const sessiondbpath = config.sessiondbpath;
const wssPort       = config.ports.wss;
const WebSocket     = require('ws');
const wss           = new WebSocket.Server({ port: wssPort });
const rpc           = require('axon-rpc');
const axon          = require('axon');
const req           = axon.socket('req');
const rep           = axon.socket('rep');
const fs            = require('fs');
const rpcClient     = new rpc.Client(req);
const rpcServer     = new rpc.Server(rep);
const models        = require('../models');
const StatusModel   = models.status;
const BucketModel   = models.bucket;

async function askHandler(data) {
    $.debug("askHandler")
    let socket             = this;
    let publicKey          = data.public_key;
    let sessionId          = data.session_id;
    let channelName        = sessionId + ':' + publicKey;
    $.deubg(channelName);
    let bucket_ret = await BucketModel.find({'public_key': publicKey});
    let hosts = [], results = [];
    let public_key, secret_key, doc;
    if(!bucket_ret) {
        $.error(new Error('bucketDataNotFound.'));
        return;
    }
    public_key = bucket_ret.public_key;
    secret_key = bucket_ret.secret_key;
    let documents = await StatusModel.all({'public_key': publicKey});
    documents.forEach(el => {
        if (hosts.indexOf(el.data.server_name) === -1) {
            hosts.push(el.data.server_name);
        }
    })
    $.deubg(hosts);
    hosts.forEach(async function(item, index, arr, doc = undefined, process_exception = undefined) {
        doc = await StatusModel.all({
            'data.server_name': item,
            'public_key': public_key,
            'type': 'all'
        })
        $.debug(doc.length);
        doc = doc[0];
        // process_exception = await findExceptionsByQuery({'data.server_name': item, 'public_key': public_key}, exceptions, {}, {sort: [['_id', 'desc']], limit: 100});
        // doc && doc.data && process_exception && (doc.data['process:exception'] = process_exception);
        results.push(doc);
        if(results.length === hosts.length) {
            results = results.filter(function(ele, index) {
                return ele !== null;
            });
            socket._emit(channelName, results);
            $.debug(channelName)
        }
    });
}

/* 兼容纯WebSocket */

function wrapper(ws) {
    ws._emit = function(message, data) {
        message = message + ':-:-:' + JSON.stringify(data);
        ws.send(message);
    };
    return ws;
};

function messageParse(message, command, data) {
    message = message.split(':-:-:');
    [command, data] = message;

    try {
        data = JSON.parse(data);
    } catch(e) {}

    return [command, data];
};

function connection(socket) {
    socket = wrapper(socket);
    $.debug('new websocket connect');
    socket.on('message', function(message, command, data) {
        [command, data] = messageParse(message);
        if(command === 'ask') {

            askHandler.bind(socket)(data);
        }

        if(command === 'execute') {
            rpcClient.call('execute', data.machine_name, data.public_key, data, false, function(error) {
                error && $.error(error);
            });
        }

        if(command === 'executeCustomAction') {
            rpcClient.call('execute', data.machine_name, data.public_key, data, true, function(error) {
                error && $.error(error);
            });
        }
    });
};

rpcServer.expose('profiling', function(machine_name, public_key, message, fn, profilings = {}) {
    // console.log('RealTimeWebSocket:askHandler:profiling');

    try {
        if(fs.existsSync(profilingsStoreFile)) {
            profilings = JSON.parse(fs.readFileSync(profilingsStoreFile));
        }

        if(!profilings.hasOwnProperty(public_key)) {
            profilings[public_key] = {};
        }

        if(!profilings[public_key].hasOwnProperty(machine_name)) {
            profilings[public_key][machine_name] = [];
        }

        profilings[public_key][machine_name].push(message);
        fs.writeFileSync(profilingsStoreFile, JSON.stringify(profilings));
        return fn(null);
    } catch (e) {
        $.error(e.stack || e);
    }

    return fn('Profiling Error');
});

wss.on('connection', connection);
req.connect(43555);
rep.bind(43666);
