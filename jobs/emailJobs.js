/* eslint-disable max-len */
const mongoose = require('mongoose');
const agenda = require('./agenda');
const config = require('../config.json');
const conEmailRecord = mongoose.createConnection(config.mongo.emailRecordUrl);
const {sendEmail} = require('../lib/helper');

const emailSchema = require('../schema/emailSchema');
const emailModel = conEmailRecord.model('Email', emailSchema);


(async function() {
  await agenda.start();
})();

agenda.define('emailJobCron', async (job) => {
  const {email, content, _id} = job.attrs.data;
  const result = await sendEmail({
    emailTo: email,
    subject: 'Email-Scheduler',
    content: content,
  });
  if (result) {
    emailModel.collection.findOneAndUpdate({_id: _id}, {$set: {status: 'sent', updatedAt: new Date()}}, {upsert: true});
  } else {
    emailModel.collection.findOneAndUpdate({_id: _id}, {$set: {status: 'failed', updatedAt: new Date()}}, {upsert: true});
  }
});


// (async function() {
//   await agenda.start();
//   await agenda.every('50 seconds', 'emailJobCron');
// })();


module.exports = agenda;
