/* eslint-disable max-len */
const mongoose = require('mongoose');
const agenda = require('./agenda');
const config = require('../config.json');
const conEmailRecord = mongoose.createConnection(config.mongo.emailRecordUrl);
const {sendEmail} = require('../lib/helper');
const moment = require('moment');

const emailSchema = require('../schema/emailSchema');
const emailModel = conEmailRecord.model('Email', emailSchema);

(async function() {
  await agenda.start();
  await agenda.every('5 seconds', 'emailJobCron');
})();

agenda.define('emailJobCron', async (job) => {
  const today = new Date();
  const newDateObj2 = moment(today).add(1, 'm').toDate();
  findCase = {status: 'scheduled', scheduledAt: {$gte: today, $lte: newDateObj2}};

  const emailList = await emailModel.find(findCase)
      .lean();
  if (emailList.length>0) {
    emailList.forEach(async (obj) => {
      console.log(obj);
      const result = await sendEmail({
        emailTo: obj?.email,
        subject: 'Email-Scheduler',
        content: obj.content,
      });
      if (result) {
        emailModel.collection.findOneAndUpdate({_id: obj._id}, {$set: {status: 'sent', updatedAt: new Date()}}, {upsert: true});
      } else {
        emailModel.collection.findOneAndUpdate({_id: obj._id}, {$set: {status: false, status: 'failed', updatedAt: new Date()}}, {upsert: true});
      }
    });
  }
});

