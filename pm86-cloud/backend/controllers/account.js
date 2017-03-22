/* jshint node: true */
'use strict';

import models from '../models';
import Base   from './base';
import $      from '../helpers';

const UserModel = models.user;
const UseAPI    = new Base({ model: UserModel });

UseAPI.methods.register = UseAPI.methods.create;

UseAPI.methods.login = async function(req, res, next) {
  let user = await UserModel.find({
    email: req.body.email,
    password: req.body.password
  });
  if ($.empty(user)) {
    $.debug(user);
    return $.result(res, 'login error');
  }
  req.session.user = user;
  $.result(res, user);
}

UseAPI.methods.logout = async function(req, res, next) {
  req.session.user = null;
  $.result(res, {
    success: true
  });
}

module.exports = UseAPI.methods
