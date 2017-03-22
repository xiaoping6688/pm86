/* jshint node: true */
'use strict';

const $           = require('../helpers');
const nssocket    = require('nssocket');
const Cipher      = $.cipher;
const rpc         = require('axon-rpc');
const axon        = require('axon');
const rep         = axon.socket('rep');
const rpcServer   = new rpc.Server(rep);
const models      = require('../models');
const BucketModel = models.bucket;
let sockets       = {};
let server        = {};

async function findOneBucketByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.findOneAsync(query);
    } catch(e) {
        $.error(e);
    }
}

server = nssocket.createServer(function(socket) {
    $.info('there is a new connection');

    socket.send('ask');
    socket.data(['ask:rep'], async function(data) {
        let query   = { public_key: data.public_key };
        let doc     = await BucketModel.find(query);
        data.data   = Cipher.decipherMessage(data.data, doc.secret_key);

        sockets[data.data.machine_name + ':' + data.public_key] = {
            socket:       this,
            secret_key:   doc.secret_key,
            machine_name: data.data.machine_name,
            public_key:   data.public_key
        };

        this.data(['trigger:pm2:result'], function(data) {
            $.info('trigger:pm2:result');
            $.info(data);
        });

        this.data(['trigger:action:failure'], function(data) {
            $.info('trigger:action:failure');
        });

        this.data(['trigger:action:success'], function(data) {
            $.info('trigger:action:success');
        });
    });
});

rpcServer.expose('execute', function(machine_name, public_key, message, isCustomAction, fn) {
    let socket_index = machine_name + ':' + public_key;
    let socket       = sockets[socket_index].socket;
    let secret_key   = sockets[socket_index].secret_key;
    let data         = Cipher.cipherMessage(JSON.stringify(message), secret_key);
    $.info('trigger:action');
    $.info(data);

    if(sockets.hasOwnProperty(socket_index) && isCustomAction) {
        socket.send('trigger:action', data);
        return fn(null);
    }

    if(sockets.hasOwnProperty(socket_index)) {
        socket.send('trigger:pm2:action', data);
        return fn(null);
    }

    fn('Socket Not Exist');
});

server.listen(43554);
rep.bind(43555);

