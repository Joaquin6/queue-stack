import log from './bunyan';
import queue from './queue';
import config from '../config';

(async () => {
  try {
    await queue.isReady();
  } catch (err) {
    log.error(err, 'Failed Worker Connection Test');
    process.exit(1); // eslint-disable-line no-process-exit
  }

  queue
    .on('completed', job => {
      log.info({ ...job.data }, 'Completed Job');
      job.remove();
    })
    .on('error', err => log.error(err, 'QUEUE JOB_FLOW ERROR'))
    .on('failed', (job, err) => log.error({ job, err }, 'QUEUE JOB_FLOW FAILED'));

  queue.process(1, `${__dirname}/processors/jobFlowProcessor.js`);

  // nodemon sends a kill signal to your application when it sees a file update.
  // If you need to clean up on shutdown inside your script you can capture the kill signal
  // and handle it yourself.
  if (!config.isProduction) {
    // The following will listen once for the SIGUSR2 signal (used by nodemon to restart),
    // run the clean up process and then kill itself for nodemon to continue control.
    // Note: the `process.kill` is only called once your shutdown jobs are complete.
    process.once('SIGUSR2', async () => {
      await queue.close();
      process.kill(process.pid, 'SIGUSR2');
    });
  }
})();
