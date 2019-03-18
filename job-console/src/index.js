import app from './app';
import queue from '../redis/queue';
import knex, { testConnection } from '../db';

(async () => {
  try {
    await Promise.all([
      testConnection(),
      queue.isReady(),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed connection test', err);
    process.exit(1); // eslint-disable-line no-process-exit
  }

  app.set('db', knex);
  app.set('queue', queue);

  const { port, timeout } = app.locals.config;
  // eslint-disable-next-line no-console
  const server = app.listen(port, () => console.log(`Application listening on port ${port}`));
  server.timeout = timeout;
})();
