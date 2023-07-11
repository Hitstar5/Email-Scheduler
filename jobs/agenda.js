const Agenda = require('agenda');

const connectionOpts = {
  db: {address: 'localhost:27017/EmailJobs', collection: 'Jobs'},
};

const agenda = new Agenda(connectionOpts);
const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];
jobTypes.forEach((type) => {
  require('./' + type)(agenda);
});

if (jobTypes.length) {
  agenda.start(); // Returns a promise, which should be handled appropriately
}

module.exports = agenda;
