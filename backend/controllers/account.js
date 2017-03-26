/* jshint node: true */
'use strict';

import models from '../models';
import Base   from './base';
import $      from '../helpers';

const UserModel = models.user;
const UserAPI    = new Base({ model: UserModel });

UserAPI.methods.register = UserAPI.methods.create;

// login
UserAPI.methods.login = async function(req, res, next) {
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

UserAPI.methods.register = async function(req, res, next) {
  const query = Object.assign({}, req.body);
  if (!query.email || !query.password) {return $.result(res, 'error');}

  const exist = await UserModel.find({email: query.email});
  if (exist) {return $.result(res, 'exist');}

  const encode     = $.encode(JSON.stringify(req.body));
  query.verifyLink = `${$.config.base_url}/verify/${query.email}/${encode}`;
  const html = createLink(query.email, query.verifyLink);
  $.sendEmail({
    subject: `欢迎您使用 PM86`,
    to: query.email,
    text: html
  })
  const user  = await UserModel.create(query);
  $.result(res, user);
}


// logout
UserAPI.methods.logout = async function(req, res, next) {
  req.session.user = null;
  $.result(res, {
    success: true
  });
}


// verify
// logout
UserAPI.methods.verify = async function(req, res, next) {
  const query      = Object.assign({}, req.body);
  let decode       = JSON.parse($.decode(query.encode));
  const user       = await UserModel.update(decode, {status: 1});
  $.result(res, user);
}

function createLink (email, link) {
    return ` <div>
            <img src='http://ohusmobs2.bkt.clouddn.com/20170323149024023196292.png'>

            <p>尊敬的PM86用户，您好: </p>

            <p> 感谢您注册成为PM86用户 </p>
            <p> 您的帐号名称为:${email} </p>

            <p> 我们需要对您的邮箱地址有效性进行验证，以免地址被滥用。
            PM86产品最新动态会通过本邮箱发送给您。
            现在进行邮箱验证 </p>

            <div> 如果您的邮件没有正确地显示以上一行的链接，
            请直接复制以下一行的url完整信息到浏览器里打开，完成邮箱认证。
            <a>${link}</a>
            </div>

            <p>-- PM86 开发者 Eric</p>
            </div>`
}


module.exports = UserAPI.methods
