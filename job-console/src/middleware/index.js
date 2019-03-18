/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

import addRequestValidator from './requestValidator';

export { default as bunyan } from './bunyan';
export { default as uuidValidator } from './uuidValidator';
export { default as addConfigToRequest } from './addConfigToRequest';
export { default as addCorrelationIdHeader } from './addCorrelationIdHeader';

export const requestValidator = addRequestValidator({ Joi });
