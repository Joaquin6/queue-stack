/* eslint-disable comma-dangle */

const { defaulted } = require('./helpers');

const DEFAULT_NODE_ENV = 'development';
const DEFAULT_AUTO_UPDATE_FREQUENCY = 30;

module.exports = function generateEnvironmentConfig({ AUTO_UPDATE_FREQUENCY, NODE_ENV }, config) {
  const env = defaulted(NODE_ENV, DEFAULT_NODE_ENV);
  const isProduction = env === 'production';
  const autoUpdate = defaulted(AUTO_UPDATE_FREQUENCY, DEFAULT_AUTO_UPDATE_FREQUENCY);

  return Object.assign(config, {
    env,
    autoUpdate,
    isProduction,
  });
};
