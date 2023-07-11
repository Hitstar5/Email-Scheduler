// eslint-disable-next-line max-len
const successResponse = ({statusCode = 200, message = 'Success', data = {}}) => {
  return {
    status: statusCode,
    message,
    data,
  };
};

// eslint-disable-next-line max-len
const errorResponse = ({statusCode = 400, message = 'Error', data = {}}) => {
  return {
    status: statusCode,
    message,
    data,
  };
};
module.exports = {
  successResponse,
  errorResponse,
};
