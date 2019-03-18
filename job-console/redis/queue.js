import Queue from 'bull';
import log from './bunyan';
import { redisUrl } from '../config';

export const queueName = 'JOB_FLOW';
const queue = new Queue(queueName, redisUrl);

queue.client
  .on('ready', () => log.info(`Redis ${queueName} Connection Ready`))
  .on('error', err => log.error(err, `REDIS ${queueName} ERROR `));

queue.testConnection = () => (
  queue.client.status === 'ready' || queue.client.status === 'connecting'
    ? Promise.resolve(queue.client) : Promise.reject(new Error('Queue Connection Failed')));

export default queue;
