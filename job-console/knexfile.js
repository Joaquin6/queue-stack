const path = require('path');

const { databaseUrl, testDatabaseUrl } = require('./config/database')(process.env, {});
const { env } = require('./config/environment')(process.env, {});

const prodLikeConfig = {
  client: 'pg',
  connection: databaseUrl,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join('.', 'db', 'migrations'),
  },
  seeds: {
    directory: path.join('.', 'db', 'seeds'),
  },
};

const knexConfigs = {
  development: Object.assign({}, prodLikeConfig, {
    asyncStackTraces: true,
  }),
  test: Object.assign({}, prodLikeConfig, {
    connection: testDatabaseUrl,
    asyncStackTraces: true,
  }),
  staging: prodLikeConfig,
  production: prodLikeConfig,
};

// eslint-disable-next-line security/detect-object-injection
module.exports = knexConfigs[env];
module.exports.raw = knexConfigs;
