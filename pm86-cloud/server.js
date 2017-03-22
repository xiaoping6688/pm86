
'use strict';
require('babel-core/register');
require("babel-polyfill");
const express              = require('express')
const favicon              = require('serve-favicon')
const logger               = require('morgan')
const debug                = require('debug')('PM86');
const cookieParser         = require('cookie-parser')
const bodyParser           = require('body-parser')
const juicerExpressAdapter = require('juicer-express-adapter')
const rewriteModule        = require('http-rewrite-middleware')
const session              = require('express-session')
const MongoStore           = require('connect-mongo')(session)
const compression          = require('compression')
const config               = require('./config')
const rewriteMiddleware    = rewriteModule.getMiddleware([])
const isProd               = process.env.NODE_ENV === 'production'
const currentConfig        = config[isProd ? 'prod' : 'dev']
const app                  = express()
const $                    = require('./backend/helpers/')
const models               = require('./backend/models/')

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(rewriteMiddleware);
app.use(compression({ threshold: 0 }))
app.use(favicon('./public/logo.png'))
// app.use('/service-worker.js', serve('./dist/service-worker.js'))
// app.use('/manifest.json', serve('./manifest.json'))

app.use(session({
    secret: 'pm86',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: currentConfig.sessiondbpath }),
    cookie: { secure: false, httpOnly: false, maxAge: 120 * 60 * 1000 * 100 }
}));

app.use('/dist',   require('./ssr')(app));
app.use('/api/v1', require('./backend/routers'));
app.set('port',    process.env.PORT || 3000);
models.connect();

const server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
module.exports = app
