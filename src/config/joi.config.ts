import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // Application variables validations
  ENVIRONMENT: Joi.string().valid('dev', 'qa', 'prod').required(),
  PORT: Joi.number(),

  // Database variables validations
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});
