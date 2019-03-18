import bunyan from 'bunyan';
import config from '../config';

const log = bunyan.createLogger({
  name: 'redis-worker',
  streams: [{
    level: config.env !== 'test' ? 'info' : 'fatal',
    stream: process.stdout,
  }],
});

export default log;
