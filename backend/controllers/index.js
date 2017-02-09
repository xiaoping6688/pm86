/* jshint node: true */
'use strict';

var models = {};

models.buckets = require('../models/buckets');

var exports = function(router) {

    router.get('api/v1/bucket/create', function(req, res) {
        res.render('bucket-create', {});
    });

    router.get('api/v1/bucket/:bucket/:public_key', function(req, res) {
        res.render('index', {
            servertime: new Date().getTime(),
            uuid: req.session.user.id,
            bucket: req.params.bucket,
            public_key: req.params.public_key
        });
    });

    router.get('api/v1/buckets', async function(req, res) {
        var userAllBucketsResult = await models.buckets.getUserAllBucketsByUUID(req.session.user.id);

        if(userAllBucketsResult) {
            res.render('buckets', {
                buckets: userAllBucketsResult
            });
        }
    });

    router.get('api/v1/transactions/server/:public_key/:server_name', function(req, res) {
        res.render('transactions', {
            public_key: req.params.public_key,
            server_name: req.params.server_name
        });
    });

    router.get('api/v1/graph/sunburst/:filename', function(req, res) {
        res.render('sunburst', {
            filename: req.params.filename
        });
    });
};
