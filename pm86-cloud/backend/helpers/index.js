import moment from 'moment';
import crypto from 'crypto';
import config from '../../config';
import log4js from 'log4js';


const iv        = '1234567890000000';
const isProd    = process.env.NODE_ENV === 'production';
const cryptkey  = crypto.createHash('sha256').update('__tazai_wolf__key').digest();

log4js.configure(config.log, {});

const logger = log4js.getLogger('debug');

logger.setLevel('auto');

module.exports           = logger;
module.exports.config    = config[isProd ? 'prod' : 'dev'];
module.exports.isProd    = isProd;
module.exports.moment    = moment;
module.exports.logAccess = log4js.connectLogger(log4js.getLogger('access'), {
  level: 'auto'
});

module.exports.decode = ( secretdata) => {
    let
    decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
    decoded  = decipher.update(secretdata, 'base64', 'utf8');

    decoded += decipher.final( 'utf8' );
    return decoded;
}

module.exports.encode = ( cleardata) => {
    let
    encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
    encoded  = encipher.update(cleardata, 'utf8', 'base64');

    encoded += encipher.final( 'base64' );
    return encoded;
}

module.exports.result = function (res, data, status) {
  let redata = {};
  if (typeof data === 'string' ||
    data === 'null' ||
    data === undefined ||
    data === null || status >= 400) {
    status = status || 400;
    redata = {
      msg: data,
      data: {}
    };
  } else {
    status = status || 200;
    redata = {
      msg: '',
      data: data
    };
  }
  res.status(status).send(redata);
};

module.exports.true = function (value) {
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string') {
    return '1 true yes ok'.split(' ').indexOf(value.trim().toLowerCase()) !== -1;
  } else {
    return !!value;
  }
};

module.exports.empty = function (value) {
  if (typeof value == 'string') {
    return value.trim() === '';
  } else if (typeof value == 'number') {
    return value === 0;
  } else {
    return value === null || value === undefined;
  }
};

module.exports.dateformat = function (obj, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (process.env.NODE_ENV === 'test') {
    return obj;
  }
  return moment(obj).format(format);
}
