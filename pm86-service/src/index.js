require('babel-core/register');
require("babel-polyfill");

var express = require('express');
var app = express();
var config = require('../configure');
var isDev = process.env.NODE_ENV === 'development';
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

app.post('/api/node/verifyPM2', function (req, res) {
    let json = {
        endpoints: isDev ? config.endpoints.dev : config.endpoints.prod,
        new: false,
        active: true,
        pending: false,
        disabled: false
    }
    console.log(json);
    res.json(json);
});

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function () {
    require('./ReverseInteractorService.js')
    require("./PullInteractorService.js")
    require("./RealTimeWebSocket.js")

    console.info('Express server listening on port ' + server.address().port);
});
