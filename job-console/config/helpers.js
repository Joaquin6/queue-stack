const { readFileSync } = require('fs');

const isDefined = (value) => typeof value !== 'undefined';

const requireDefined = (name, value, extraErrorMessage = '') => {
  if (!isDefined(value)) {
    throw new Error(`Configuration value '${name}' is required${extraErrorMessage}`);
  }
};

const defaulted = (value, defaultValue) => {
  if (isDefined(value)) {
    return value;
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};

const defaultedExceptProduction = (name, value, defaultValue, isProduction) => {
  if (isProduction) {
    requireDefined(name, value, ' in production');
  }

  return defaulted(value, defaultValue);
};

const defaultedWithStaticProduction = (value, defaultValue, productionValue, isProduction) =>
  (isProduction ? productionValue : defaulted(value, defaultValue));

const variablyDefaulted = (value, defaultValue, productionDefaultValue, isProduction) =>
  defaulted(value, (isProduction ? productionDefaultValue : defaultValue));

const processedOrDefault = (value, processing, defaultValue) => {
  if (isDefined(value)) {
    return processing(value);
  }

  if (typeof defaultValue === 'function') {
    return defaultValue();
  }

  return defaultValue;
};

const fileFallbackDefaultedExceptProduction = (name, env, defaultValue, isProduction) => {
  if (isDefined(env[name])) {
    return env[name];
  }

  const namePath = `${name}_PATH`;
  if (isDefined(env[namePath])) {
    return readFileSync(env[namePath]).toString();
  }

  return defaultedExceptProduction(name, undefined, defaultValue, isProduction);
};

module.exports = {
  isDefined,
  requireDefined,
  defaulted,
  defaultedExceptProduction,
  defaultedWithStaticProduction,
  variablyDefaulted,
  processedOrDefault,
  fileFallbackDefaultedExceptProduction,
};
