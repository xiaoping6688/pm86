/* jshint node: true */
'use strict';

var config = require('../configure');
var express = require('express')
var router = express.Router()
var models = {};

models.buckets = require('../models/buckets');
models.transactions = require('../models/transactions');
models.users = require('../models/users');

router.post('/v1/user/register', async function(req, res) {
  if (!req.body.password || !req.body.email) {
    res.json({ status: -1 });
    return;
  }
  var user = await models.users.createUser(req.body);
  if(user === -1) {
    res.json({ status: -1 });
  } else {
    req.session.user = {
      "id": user.ops[0]._id
    };
    res.json({ status: 0 });
  }
});

router.post('/v1/user/login', async function(req, res) {
  var users = await models.users.getUser(req.body);

  if(users && users.length) {
    req.session.user = {
      "id": users[0]._id
    };
    res.json({ status: 0 });
  } else {
    res.json({ status: -1 });
  }
});

router.post('/v1/user/logout', async function(req, res) {
  if(req.session.user.id) {
    req.session.user = {};
    res.json({ status: 0 });
  } else {
    res.json({ status: -1 });
  }
});

router.post('/v1/user/remove', async function(req, res) {
  var user = await models.users.removeUser(req.body, req.session.user.id);
  if(user) res.json({ status: 0 });
});

router.get('/v1/buckets', async function(req, res) {
  if(!req.session.user) {
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
