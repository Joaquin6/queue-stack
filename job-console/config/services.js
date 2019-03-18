const { defaulted, processedOrDefault } = require('./helpers');

const DEFAULT_JOB_CONSOLE_URL = 'http://localhost:3100';
const DEFAULT_POLLING_INTERVAL_MS = 30000;

module.exports = function generateHttpConfig({ JOB_CONSOLE_URL, POLLING_INTERVAL_MS }, config) {
  const pollingIntervalMs = processedOrDefault(
    POLLING_INTERVAL_MS,
    (t) => parseInt(t, 10),
    DEFAULT_POLLING_INTERVAL_MS,
  );

  return Object.assign(config, {
    pollingIntervalMs,
    jobConsoleUrl: defaulted(JOB_CONSOLE_URL, DEFAULT_JOB_CONSOLE_URL),
  });
};
