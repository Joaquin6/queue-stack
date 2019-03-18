const { defaultedExceptProduction, processedOrDefault } = require('./helpers');

const DEFAULT_REDIS_PORT = 6379;
const DEFAULT_REDIS_HOST = 'job-console-redis';
const DEFAULT_REDIS_URL = `redis://${DEFAULT_REDIS_HOST}:${DEFAULT_REDIS_PORT}`;

module.exports = function generateRedisConfig({
  REDIS_URL,
  REDIS_HOST,
  REDIS_PORT,
}, config) {
  const redisUrl = defaultedExceptProduction('REDIS_URL', REDIS_URL, DEFAULT_REDIS_URL);
  const redisHost = defaultedExceptProduction('REDIS_HOST', REDIS_HOST, DEFAULT_REDIS_HOST);
  const redisPort = processedOrDefault(REDIS_PORT, (t) => parseInt(t, 10), DEFAULT_REDIS_PORT);
  return Object.assign(config, { redisUrl, redisHost, redisPort });
};
