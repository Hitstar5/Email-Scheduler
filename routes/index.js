const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const email = require('../module/controller/emailController');

/** **************************** email-apis *******************************/

router
    .route('/email')
    .post([email.scheduleResponse])
    .put([email.rescheduleResponse])
    .get([email.getAllScheduleResponse]);

router
    .route('/email/schedule/:id')
    .get([email.getScheduleIdResponse])
    .delete([email.deleteScheduleIdResponse]);

router
    .route('/email/list/status')
    .get([email.getAllFailedScheduleResponse]);

module.exports = router;
