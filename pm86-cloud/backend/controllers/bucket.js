/* jshint node: true */
'use strict';

import models from '../models'
import crypto from 'crypto';
import Base   from './base';

const BucketModel  = models.bucket;
const prime_length = 60;
const diffHell     = crypto.createDiffieHellman(prime_length);

const BucketAPI = new Base({
  model: BucketModel
});

BucketAPI.methods.create = async function(req, res, next) {
  const secret_key = diffHell.getPrivateKey('hex');
  const public_key = diffHell.getPublicKey('hex');
  const bucketData = {
    'user':               req.session.user._id,
    'secret_key':         secret_key,
    'public_key':         public_key,
    'bucket_name':        req.body.bucket_name,
    'bucket_description': req.body.bucket_description
  };
  let user = await User.find({
    'email': req.body.email
  });
  if (user) {
    return $.result('email error');
  }
  user = await User.create(req.body);
  req.session.user = user;
  $.result(user);
}

module.exports = BucketAPI.methods
