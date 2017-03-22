/* jshint node: true */
'use strict';

import express from 'express'
import controllers from '../controllers'

const router = express.Router()

// account
router.post('/account/register', controllers.account.register);
router.post('/account/login', controllers.account.login);
router.post('/account/logout', controllers.account.logout);
router.post('/account/delete', controllers.account.delete);


// bucket
router.get('/buckets', controllers.bucket.all);
router.post('/bucket/create', controllers.bucket.create);
router.post('/bucket/delete', controllers.bucket.delete);

module.exports = router
