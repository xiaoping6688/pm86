import config from '../../config';
import nodemailer from 'nodemailer';


const mailTransport = nodemailer.createTransport(config.email);

export default function (options) {
  let defaultOption = {
    from:        config.email.auth.user,
    to:          options.to,
    // cc:       ''    //抄送
    // bcc:      ''    //密送
    subject:     options.subject || '一封来自 PM86 的邮件',
    text:        options.text || '一封来自 PM86 的邮件',
    html:        `<h1>${options.text}</h1><p><img src="cid:00000001"/></p>`,
    attachments: [],
  };
  mailTransport.sendMail(defaultOption)
};
