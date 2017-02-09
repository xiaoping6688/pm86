/* jshint node: true */
'use strict';

var config = require('../configure');
var express = require('express')
var router = express.Router()
var models = {};

models.buckets = require('../models/buckets');
models.transactions = require('../models/transactions');


router.get('/v1/buckets', async function(req, res) {
  req.session.user = {
    "id": "123"
  }
  if(!req.session.uuid && !req.query.uuid) {
    res.json({ status: -1 });
    return;
  }
  var userAllBucketsResult = await models.buckets.getUserAllBucketsByUUID(req.session.user.id);
  if(userAllBucketsResult) res.json({ buckets: userAllBucketsResult });
});

router.post('/v1/bucket/create', async function(req, res) {
  var createNewBucketResult = await models.buckets.createNewBucket(req.body, req.session.user.id);

  if(createNewBucketResult === -1) { // 当前用户下的桶名已经存在
    res.json({ status: -1 });
  } else {
    res.json({ status: 0 });
  }
});

router.post('/v1/bucket/remove', async function(req, res) {
  var removeExistBucketResult = await models.buckets.removeExistBucket(req.body, req.session.user.id);
  if(removeExistBucketResult) res.json({ status: 0 });
});

router.get('/v1/transactions/server/:public_key/:server_name', async function(req, res) {
  var serverAllTransactions = await models.transactions.getServerAllTransactions(req.params.public_key, req.params.server_name);
  if(serverAllTransactions) res.json({ data: serverAllTransactions });
});

module.exports = router
