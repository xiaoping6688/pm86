/* jshint node: true */
'use strict';

import models from '../models'
import crypto from 'crypto';
import Base   from './base';
import $      from '../helpers';

const BucketModel  = models.bucket;
const prime_length = 60;
const diffHell     = crypto.createDiffieHellman(prime_length);



const BucketAPI = new Base({
  model: BucketModel
});

BucketAPI.methods.all = async function(req, res, next) {
  if ($.empty(req.session.user)) {return $.result(res, []);}
  const bucket = await BucketModel.all({'user': req.session.user._id});
  $.result(res, bucket);
}

BucketAPI.methods.create = async function(req, res, next) {
  if ($.empty(req.session.user)) {return $.result(res, []);}
  diffHell.generateKeys('base64');
  const secret_key = diffHell.getPrivateKey('hex');
  const public_key = diffHell.getPublicKey('hex');
  const bucketData = {
    'user':               req.session.user._id,
    'secret_key':         secret_key,
    'public_key':         public_key,
    'bucket_name':        req.body.bucket_name,
    'bucket_description': req.body.bucket_description
  };
  const bucket = await BucketModel.create(bucketData);
  $.result(res, bucket);
}


BucketAPI.methods.verify = async function (req, res) {
  $.debug(req.body);
  // const bucket = await BucketModel.find(req.body);
  // if ($.empty(bucket)) {
  //   res.json({
  //     endpoints: {},
  //     new: false,
  //     active: false,
  //     pending: false,
  //     disabled: false
  //   });
  //   return;
  // }
  res.json({
    endpoints: $.config.endpoints,
    new: false,
    active: true,
    pending: false,
    disabled: false
  });
}

module.exports = BucketAPI.methods
