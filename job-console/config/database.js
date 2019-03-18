const url = require('url');
const { defaulted, defaultedExceptProduction } = require('./helpers');

const DEFAULT_DATABASE_URL = 'postgres://localhost/job-console-db';

module.exports = function generateDatabaseConfig({
  DATABASE_URL,
  TEST_DATABASE_URL,
}, config) {
  const databaseUrl = defaultedExceptProduction('DATABASE_URL', DATABASE_URL, DEFAULT_DATABASE_URL);
  return Object.assign(config, { databaseUrl });
};
