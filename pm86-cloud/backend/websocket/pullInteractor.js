/* jshint node: true */
'use strict';

const axon        = require('axon');
const $           = require('../helpers');
const rpc         = require('axon-rpc');
const sock        = axon.socket('pull');
const req         = axon.socket('req');
const models      = require('../models');
const StatusModel = models.status;
const BucketModel = models.bucket;
const UserModel   = models.user;
const Cipher      = $.cipher;
const rpcClient   = new rpc.Client(req);


async function sendEmail (msg, secret_key) {
  const bucket = await BucketModel.find({
    public_key: msg.public_key,
    secret_key: secret_key
  });
  const exception = msg.data["process:exception"][0];
  const stack = exception.data.stack.replace(/\s+/g,"");
  const date = $.dateformat(exception.at);
  const html = `<p>${date}</p>
                <p>${exception.process.name}</p>
                <p>${exception.process.server}</p>
                <p>${exception.process.rev}</p>
                <p>${stack}</p>`

  $.debug(`Error in ${bucket.user.email}`);
  $.sendEmail({
    subject: `${date} Process:exception: ${msg.data.server_name}`,
    to: bucket.user.email,
    text: html
  })
}

async function insertProcess(msg, secret_key) {

    msg.data       = Cipher.decipherMessage(msg.data, secret_key);
    msg.createdAt = new Date();

    if (msg.data === null || !msg.data) {
        return $.error(new Error('insertProcess:decipherMessageFailed:' + secret_key));
    }

    for (let process in msg.data.monitoring.processes) {
        if (msg.data.monitoring.processes.hasOwnProperty(process)) {
            if (process.match(/\./igm)) {
                msg.data.monitoring.processes[process.replace(/\./igm, '-')] = msg.data.monitoring.processes[process];
                delete msg.data.monitoring.processes[process];
            }
        }
    }

    // 从数据中剥离进程事件插入到独立的Collection
    if (msg.data.hasOwnProperty('process:event')) {
        insertExtendInfo(msg.data['process:event'], msg.public_key, msg.data.server_name, 'events', 'event');
    }

    // 从数据中剥离进程异常信息插入到独立的Collection
    if (msg.data.hasOwnProperty('process:exception')) {
        await sendEmail(msg, secret_key);
        insertExtendInfo(msg.data['process:exception'], msg.public_key, msg.data.server_name, 'exceptions', 'exception');
    }

    // 从数据中剥离服务整体监控指标插入到独立的Collection
    if (msg.data.hasOwnProperty('monitoring')) {
        insertExtendInfo(msg.data['monitoring'], msg.public_key, msg.data.server_name, 'monitorings', 'monitoring');
    }

    // 从数据中剥离HTTP传输信息插入到独立的Collection
    if (msg.data.hasOwnProperty('http:transaction')) {
        if (Array.isArray(msg.data['http:transaction'])) {
            msg.data['http:transaction'].forEach(function (transaction, index, arr) {
                insertExtendInfo(transaction, msg.public_key, msg.data.server_name, 'transactions', 'transaction');
            });
        }
    }

    // 插入当前收集到的数据到总的结果集
    msg.type = 'all';
    let result = await StatusModel.create(msg);

    return result;
};

async function insertExtendInfo(data, public_key, server_name, type, field_name) {
    let msg = {
        'public_key': public_key,
        'sent_at':    new Date().getTime(),
        'created_at': new Date(),
        'type':       type,
        'data':       {
            'server_name': server_name,
            [field_name]:  data
        }
    };
    let result = await StatusModel.create(msg);
};

async function messageHandler(msg, data) {

    try {
        msg = JSON.parse(msg);
    } catch (e) {
        $.error(new Error('messageParseError'));
        return;
    }

    let query = { public_key: msg.public_key };
    // $.debug(query);
    let doc = await BucketModel.find(query);

    if (!doc) {
        $.error(new Error('publicKeyNotFound.'));
        return;
    }

    if (data && (msg.heapdump || msg.cpuprofile)) {
        profilingProcess(msg, data);
        return;
    }

    insertProcess(msg, doc.secret_key);
}

function profilingProcess(msg, data) {
    let path = require('path');
    let fs = require('fs');
    let fileName = `${msg.server_name}.${msg.public_key}.${msg.name}.${msg.pm_id}`;


    if (msg.heapdump) {
        fileName = fileName + '.heapsnapshot';
    }

    if (msg.cpuprofile) {
        fileName = fileName + '.cpuprofile';
    }

    try {
        if (!fs.existsSync(path.join(process.env.PWD, 'profilings'))) {
            fs.mkdirSync(path.join(process.env.PWD, 'profilings'));
        }

        fs.writeFileSync(path.join(process.env.PWD, 'profilings', fileName), data);

        $.debug('PullInteractorService:profilingProcess:rpcClient.call');
        rpcClient.call('profiling', msg.server_name, msg.public_key, {
            status:      'success',
            server_name: msg.server_name,
            public_key:  msg.public_key,
            name:        msg.name,
            pm_id:       msg.pm_id,
            heapdump:    msg.heapdump,
            cpuprofile:  msg.cpuprofile,
            file_name:   fileName,
            timestamp:   Date.now()
        }, function (error) {
            error && $.error(error);
        });
    } catch (e) {
        $.error(e.stack || e);
    }

}

sock.bind(8080);
sock.on('message', messageHandler.bind(sock));
sock.on('process:exception', function () {});
req.connect(43666);
