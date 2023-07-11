const {errorStatusCode} = require('../lib/constants');
const {checkEmailIsValid, isEmpty} = require('../lib/helper');
// eslint-disable-next-line max-len
const {validationMessage} = require('../lib/validation/responseMessage');
const {errorResponse} = require('../lib/validation/responseValidation');


const errorFormat = (errorMessage) => {
  return errorResponse({data: errorMessage});
};

const sendErrorResponse = (res, errorMessage) => {
  return res.status(errorStatusCode).send(errorFormat(errorMessage));
};


const loginValidation = (req, res, next) => {
  const bodyObj = req.body;
  if (isEmpty(bodyObj?.loginId)) {
    return sendErrorResponse(res, validationMessage.emailRequired);
  }
  req.body.loginId = bodyObj.loginId.trim()?.toLowerCase();

  next();
};

const registerValidation = (req, res, next) => {
  const bodyObj = req.body;
  // const error = {};

  if (bodyObj.email) {
    const validEmailStatus = emailValidation(bodyObj?.email);
    if (!(validEmailStatus.isValid)) {
      return sendErrorResponse(res, validEmailStatus.message);
    }
  }
  if (isEmpty(bodyObj?.firstName)) {
    return sendErrorResponse(res, validationMessage.firstNameRequired);
  }
  if (isEmpty(bodyObj?.lastName)) {
    return sendErrorResponse(res, validationMessage.lastNameRequired);
  }
  if (!bodyObj.password) {
    return sendErrorResponse(res, validationMessage.passwordRequired);
  }
  if (bodyObj.email) {
    req.body.email = bodyObj.email.toLowerCase();
  }
  req.body.firstName = bodyObj.firstName.trim();
  req.body.lastName = bodyObj.lastName.trim();
  req.body.password = bodyObj.password.trim();
  next();
};

const emailValidation = (email) => {
  if (!email) {
    return {isValid: false, message: validationMessage.emailRequired};
  }
  if (!checkEmailIsValid(email)) {
    return {isValid: false, message: validationMessage.emailFormat};
  }
  return {isValid: true};
};

const requestValidation = {
  loginValidation,
  registerValidation,
  emailValidation,
};

module.exports = requestValidation;
