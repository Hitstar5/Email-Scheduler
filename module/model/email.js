/* eslint-disable max-len */
const mongoose = require('mongoose');
const config = require('../../config.json');
const conEmailRecord = mongoose.createConnection(config.mongo.emailRecordUrl);

const moment = require('moment');
const {DateTime} = require('luxon');
const agenda = require('../../jobs/agenda.js');
const {
  errorMessage,
  successMessage,
} = require('../../lib/validation/responseMessage');
const {
  checkEmailIsValid,
  checkDateIsValid,
  formatNewDateTypes,
} = require('../../lib/helper');

const emailSchema = require('../../schema/emailSchema');
const emailModel = conEmailRecord.model('Email', emailSchema);

const email = {};

// Scheduled email

email.schedule = req = (req) => {
  return new Promise(async (resolve, reject) => {
    let {email, content = '', date, time, timezone = 'PST'} = req.body;

    email = email?.trim()?.toLowerCase();
    if (email && !checkEmailIsValid(email)) {
      reject(errorMessage.invalidEmailFormat);
      return;
    }
    if (date && !checkDateIsValid(date)) {
      reject(errorMessage.invalidDateFormat);
      return;
    }
    const scheduledAt = await dateTimeCombined(date, time, timezone);
    if (scheduledAt && scheduledAt < new Date()) {
      reject(errorMessage.invalidDateTimeFormat);
      return;
    }
    const id = new mongoose.Types.ObjectId();
    insertObj = {
      _id: id.toString(),
      email: email,
      content: content,
      status: 'scheduled',
      scheduledAt: scheduledAt,
      createdAt: new Date(),
    };

    emailModel.collection.insertOne(insertObj, async (err, res) => {
      if (err) {
        reject(errorMessage.tryAgain);
      } else {
        const documentId = res?.insertedId;
        agenda.start();
        const job = await agenda.create('emailJobCron', {
          _id: documentId, email: email, content: content,
        }).schedule(scheduledAt).priority('high').save();

        Promise.resolve(job).then(async (res)=>{
          if (res?.attrs?._id) {
            const finalResult = await emailModel.collection.findOneAndUpdate({_id: documentId}, {$set: {jobId: res.attrs._id.toString()}}, {upsert: true});
            if (finalResult) {
              resolve(successMessage.emailScheduled);
            }reject(errorMessage.tryAgain);
          }
        });
      }
    });
  });
};

// Re-scheduled email

email.reschedule = req = (req) => {
  return new Promise(async (resolve, reject) => {
    let {scheduleId, email, content, date, time, timezone = 'PST'} = req.body;

    if (!scheduleId) {
      reject(errorMessage.idError);
      return;
    }
    email = email?.trim()?.toLowerCase();
    if (email && !checkEmailIsValid(email)) {
      reject(errorMessage.invalidEmailFormat);
      return;
    }
    if (date && !checkDateIsValid(date)) {
      reject(errorMessage.invalidDateFormat);
      return;
    }
    const scheduledAt = await dateTimeCombined(date, time, timezone);
    if (scheduledAt && scheduledAt < new Date()) {
      reject(errorMessage.invalidDateTimeFormat);
      return;
    }

    const findCase = {_id: scheduleId};

    const documentData = await await emailModel.findOne(findCase).lean();
    if (!documentData) {
      return reject(errorMessage.emailNotRescheduled);
    }

    const updateObj = {
      email: email,
      content: content,
      status: 'scheduled',
      scheduledAt: scheduledAt,
      updatedAt: new Date(),
    };

    // eslint-disable-next-line max-len
    emailModel.collection.findOneAndUpdate(
        {_id: scheduleId},
        {$set: updateObj},
        {new: true},
        async (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.value) {
              const jobId = new mongoose.Types.ObjectId(documentData.jobId);
              agenda.start();
              const job = await agenda
                  .create('emailJobCron', {_id: scheduleId, email: email, content: content})
                  .schedule(scheduledAt).unique({'_id': jobId})
                  .save();
              if (job) {
                resolve(successMessage.emailRescheduled);
              } else {
                reject(errorMessage.emailNotRescheduled);
              }
            } else {
              reject(errorMessage.emailNotRescheduled);
            }
          }
        },
    );
  });
};


// All email scheduled list

email.getAllSchedule = (req) => {
  return new Promise(async (resolve, reject) => {
    let {limit, page, searchtext='', sortType} = req.query;
    limit = limit * 1;
    page = Math.max(0, req.query.page);

    // eslint-disable-next-line no-unused-vars
    sortType = sortType == 'createdAt' ?'-createdAt' :
        sortType == 'scheduledAt' ?'-scheduledAt' :'-createdAt';

    const findCase = {
      email: {$regex: searchtext, $options: 'i'},
      _id: {$regex: searchtext, $options: 'i'},
    };

    const result = await emailModel.find(findCase)
        .sort(sortType).skip(page * limit).limit(limit).lean();
    resolve(result);
  });
};

// get schedule by id
email.getScheduleId = (req) => {
  return new Promise(async (resolve, reject) => {
    const {id} = req.params;
    const findCase = {_id: id};
    const result = await emailModel.findOne(findCase).lean();
    if (result) {
      resolve(result);
    } else {
      reject(errorMessage.notFound);
    }
  });
};

// delete scheduled
email.deleteScheduleId = (req) => {
  return new Promise(async (resolve, reject) => {
    const {id} = req.params;

    const findCase = {_id: id};

    const documentData = await await emailModel.findOne(findCase).lean();
    if (!documentData) {
      return reject(errorMessage.emailNotRescheduled);
    }
    const result = await emailModel.findOneAndDelete(findCase);
    if (result) {
      const jobId = new mongoose.Types.ObjectId(documentData.jobId);
      await agenda.cancel({_id: jobId});
      resolve(successMessage.emailDeleted);
    } else {
      reject(errorMessage.notFound);
    }
  });
};

// eslint-disable-next-line require-jsdoc
async function dateTimeCombined(date, startTime, timezone) {
  const zones = {
    PST: 'America/Los_Angeles', // "UTC-8",//
    MST: 'America/Denver', // "UTC-7",//
    CST: 'America/Chicago', // "UTC-6",//
    EST: 'America/New_York', // "UTC-5",//
    AST: 'America/Halifax', // "UTC-4",//
    IST: 'Asia/Calcutta', // "UTC+5:30",//
  };

  const momentTime = moment(startTime, ['h:mm:ss a']).format('HH:mm:00');

  const newDate = new Date(`${date + 'T' + momentTime + 'Z'}`);
  // eslint-disable-next-line max-len
  const simpleFormat = await formatNewDateTypes(
      'EEE, MM dd, yyyy hh:mm:ss a',
      newDate,
      startTime,
  );
  const pstUtc = DateTime.fromFormat(
      simpleFormat,
      'EEE, MM dd, yyyy hh:mm:ss a',
      {zone: zones[timezone]},
  ).toUTC();

  return new Date(pstUtc.toLocaleString(DateTime.DATETIME_FULL));
}


// All failed email list

email.getAllFailedSchedule = (req) => {
  return new Promise(async (resolve, reject) => {
    let {limit, page, searchtext='failed', sortType} = req.query;
    limit = limit * 1;
    page = Math.max(0, req.query.page);

    // eslint-disable-next-line no-unused-vars
    sortType = sortType == 'updatedAt' ?'-updatedAt' :
          sortType == 'scheduledAt' ?'-scheduledAt' :'-updatedAt';

    const findCase = {
      status: searchtext,
    };

    const result = await emailModel.find(findCase)
        .sort(sortType).skip(page * limit).limit(limit).lean();
    resolve(result);
  });
};


module.exports = email;
