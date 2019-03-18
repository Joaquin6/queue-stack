const { defaulted, processedOrDefault } = require('./helpers');

const DEFAULT_PORT = 3100;
const DEFAULT_TRUST_PROXY_HOPS = false;
const DEFAULT_TIMEOUT = 0;

module.exports = function generateHttpConfig({ PORT, TIMEOUT, TRUST_PROXY_HOPS }, config) {
  return Object.assign(config, {
    trustProxy: processedOrDefault(
      TRUST_PROXY_HOPS,
      (t) => parseInt(t, 10),
      DEFAULT_TRUST_PROXY_HOPS // eslint-disable-line comma-dangle
    ),
    port: defaulted(PORT, DEFAULT_PORT),
    timeout: defaulted(TIMEOUT, DEFAULT_TIMEOUT),
  });
};
