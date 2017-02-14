require('babel-core/register');
require("babel-polyfill");

var express = require('express');
var app = express();
var config = require('../configure');
var path = require('path');
var fs = require('fs');
var cors = require('cors');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/api/node/verifyPM2', function(req, res) {
    res.json({
        endpoints: config.endpoints,
        new: false,
        active: true,
        pending: false,
        disabled: false
    });
});

var pmx = require('pmx');

pmx.action('hello', function(reply) {
  reply({ answer : 'world' });
});

setInterval(function() {
  // Keep application online
}, 100);

app.set('port', process.env.PORT || 8000);
app.set('env', 'development');
app.use(express.static(path.join(process.env.PWD, 'profilings')));

var server = app.listen(app.get('port'), function() {
    require('./ReverseInteractorService.js')
    require("./PullInteractorService.js")
    require("./RealTimeWebSocket.js")
    
    console.info('Express server listening on port ' + server.address().port);
});
