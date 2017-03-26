/* jshint node: true */
'use strict';

import models from '../models';
import Base   from './base';
import $      from '../helpers';

const AuthCodeModel = models.authCode;
const AuthCodeAPI   = new Base({ model: AuthCodeModel });

// create auth_code
AuthCodeAPI.methods.create = async function(req, res, next) {
  if (!req.body.email) {return $.result(res, 'email error');}

  const code = Math.random().toString(36).substring(20);
  const authCode = await AuthCodeModel.create({
    code: code,
    email: req.body.email
  });
  const html = `<div>您的验证码是 ${code}</div>
                <div>有效期半小时</div>`;
  $.sendEmail({
    subject: `PM86 - 您的验证码是 ${code}`,
    to: req.body.email,
    text: html
  })
  $.result(res, authCode);
}


module.exports = AuthCodeAPI.methods
