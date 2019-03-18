const { defaultedExceptProduction } = require('./helpers');

const DEFAULT_COOKIE_SECRET = 'thisisasecretstringvalueforourcookiesession';

module.exports = function generateCookieConfig({
  COOKIE_SECRET,
}, config) {
  return Object.assign(config, {
    cookieSecret: defaultedExceptProduction(COOKIE_SECRET, DEFAULT_COOKIE_SECRET),
  });
};
