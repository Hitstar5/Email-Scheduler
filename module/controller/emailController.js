const email = require('../model/email');
// eslint-disable-next-line max-len
const {successResponse, errorResponse} = require('../../lib/validation/responseValidation');


exports.scheduleResponse = (req, res) => {
  email.schedule(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};

exports.rescheduleResponse = (req, res) => {
  email.reschedule(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};

exports.getAllScheduleResponse = (req, res) => {
  email.getAllSchedule(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};

exports.getScheduleIdResponse = (req, res) => {
  email.getScheduleId(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};

exports.deleteScheduleIdResponse = (req, res) => {
  email.deleteScheduleId(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};


exports.getAllFailedScheduleResponse = (req, res) => {
  email.getAllFailedSchedule(req).then((result) => {
    const response = successResponse({data: result});
    res.status(200).send(response);
  }).catch((err) => {
    const response = errorResponse({data: err});
    res.status(400).send(response);
  });
};
