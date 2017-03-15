'use strict';

require('babel-core/register');
require("babel-polyfill");

var debug = require('debug')('PM86');
var app = require('./server');

app.set('port', process.env.PORT || 3000);
// app.set('env', 'production');

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
