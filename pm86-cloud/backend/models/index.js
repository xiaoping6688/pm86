import mongoose from 'mongoose';
import $        from '../helpers';
import user     from './user';
import bucket   from './bucket';
const dbpath    = $.config.dbpath;

module.exports.connect = function () {

  mongoose.Promise = global.Promise;
  mongoose.connect(dbpath, {
    server: { poolSize: 20 }
  }, function (err) {
    $.info(dbpath);
    if (err) {
      $.error(`connect to ${dbpath} error: ${err.message}`)
      process.exit(1);
    }
    return mongoose.connection;
  });
}


module.exports.bucket = bucket;
module.exports.user   = user;
