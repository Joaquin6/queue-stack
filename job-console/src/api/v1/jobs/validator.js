import Joi from 'joi';
import { requestValidator } from '../../../middleware';

export const schemas = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
  }).required(),
  get: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }).required(),
  cancel: Joi.object().keys({
    jobId: Joi.string().uuid().required(),
  }).required(),
};

export default {
  cancel: requestValidator(schemas.cancel, 'params'),
  post: requestValidator(schemas.create),
  get: requestValidator(schemas.get, 'params'),
};
