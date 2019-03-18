/* eslint-disable global-require, import/no-dynamic-require, comma-dangle */

const generateConfig = (env) => [
  './environment',
  './services',
  './cookies',
  './database',
  './redis',
  './http',
].map((file) => require(file)).reduce((config, configurator) => configurator(env, config), {});

module.exports = generateConfig;
