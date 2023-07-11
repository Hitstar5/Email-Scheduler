const nodemailer = require('nodemailer');
const moment = require('moment');
const helper = {};

helper.checkEmailIsValid = (email) => {
  const emailRegex =
    // eslint-disable-next-line max-len
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
};

helper.checkDateIsValid = (date) =>{
  if (!moment(date, 'YYYY-MM-DD').isValid()) {
    return false;
  }
  return true;
};

helper.isEmpty = (text) => {
  // eslint-disable-next-line max-len
  return !(
    text?.toString()?.trim()?.length > 0 && text?.toString()?.trim() !== '0'
  );
};

helper.sendEmail = async ({emailTo, subject, content}) => {
  try {
    const MAIL_SETTINGS = {
      requireTLS: true, // Force TLS
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(MAIL_SETTINGS);
    const receiver = emailTo;

    const mailOptions = {
      from: MAIL_SETTINGS.auth.user,
      to: receiver,
      subject: subject,
      text: content,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log('Send Email error', error);
    return false;
  }
};

helper.formatNewDateTypes = (formatStr, date, timeSplit, opts) =>{
  if (!date) {
    date = new Date();
  }

  opts = opts || {};

  let _days = opts.days;

  if (!_days) {
    _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  let _months = opts.months;

  if (!_months) {
    // eslint-disable-next-line max-len
    _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  const pad = (number, strDigits, isUnpad) => {
    const strNum = Math.abs(number).toString();
    if (!isUnpad && strNum.length > strDigits.length) {
      return strNum;
    } else {
      return ('0000' + strNum).slice(-strDigits.length);
    }
  };

  const DELIM = '\0\0';
  const escapeStack = [];

  const escapedFmtStr = formatStr.replace(/'.*?'/g, (m) => {
    escapeStack.push(m.replace(/'/g, ''));
    return `${DELIM}${escapeStack.length - 1}${DELIM}`;
  });

  const formattedStr = escapedFmtStr
      .replace(/y{4}|y{2}/g, (m) => pad(date.getFullYear(), m, true))
      .replace(/M{3}/g, (m) => _months[date.getMonth()])
      .replace(/M{1,2}/g, (m) => pad(date.getMonth() + 1, m))
      .replace(/M{1,2}/g, (m) => pad(date.getMonth() + 1, m))
      .replace(/d{1,2}/g, (m) => pad(date.getDate(), m))
      .replace(/[E]+/g, (m) => _days[date.getDay()]);


  // eslint-disable-next-line max-len
  let unescapedStr = formattedStr.replace(new RegExp(`${DELIM}\\d+${DELIM}`, 'g'),
      (m) => {
        const unescaped = escapeStack.shift();
        return unescaped.length > 0 ? unescaped : '\'';
      });
  unescapedStr = unescapedStr.replace('hh:mm:ss a', `${timeSplit}`);

  return unescapedStr;
};

module.exports = helper;
