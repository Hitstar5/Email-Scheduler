/* eslint-disable max-len */
const Agenda = require('agenda');


const agenda = new Agenda({
  db: {
    address: 'localhost:27017/EmailJobs',
    collection: 'Jobs',
    options: {useUnifiedTopology: true},
  },
  processEvery: '20 seconds',
  maxConcurrency: 20,
});

// listen for the ready or error event.
agenda
    .on(`ready`, () => {
      console.log('Agenda started!');
    //       {
    //         lockedAt: {
    //           $exists: true,
    //         },
    //         lastFinishedAt: {
    //           $exists: false,
    //         },
    //       },
    //       {
    //         $unset: {
    //           lockedAt: undefined,
    //           lastModifiedBy: undefined,
    //           lastRunAt: undefined,
    //         },
    //         $set: {
    //           nextRunAt: new Date(),
    //         },
    //       },
    //       {
    //         multi: true,
    //       },
    //       function(err, numUnlocked) {
    //         if (err) {
    //           console.error(err);
    //         }
    //         if (process.env.NODE_ENV !== 'test') {
    //           console.log(
    //               '[Worker] Unlocked %d Agenda jobs.',
    //               parseInt(numUnlocked, 10) || 0,
    //           );
    //         }
    //         client.close(callback);
    //       },
    //   );
    })
    .on(`error`, () => console.log('Agenda connection error!'));

module.exports = agenda;
