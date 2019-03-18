import Joi from 'joi';

export const uuidSchema = Joi.string().uuid();

export const DEFAULT_MESSAGE = 'The requested ID is not a valid ID';

export default function uuidValidator(req, res, next, id) {
  uuidSchema.validate(id, (err) => {
    if (err) {
      return res.status(400).json({
        code: 400,
        message: DEFAULT_MESSAGE,
      }).end();
    }
    return next();
  });
}
