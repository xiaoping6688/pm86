/* jshint node: true */
'use strict';

import express     from 'express';
import controllers from '../controllers';
import $           from '../helpers';

const router = express.Router();
const authSession = $.auth.session;


// account

router.post('/account/register',  controllers.account.register);
router.post('/account/login',     controllers.account.login);
router.post('/account/logout',    controllers.account.logout);
router.post('/account/verify',    controllers.account.verify);
router.post('/account/delete',    authSession, controllers.account.delete);


// auth code
router.put('/authcode',  controllers.authCode.create);

// bucket

router.get('/buckets',          authSession, controllers.bucket.all);
router.put('/bucket/create',    authSession, controllers.bucket.create);
router.delete('/bucket/delete', authSession, controllers.bucket.delete);
router.post('/bucket/verify', controllers.bucket.verify);

module.exports = router
