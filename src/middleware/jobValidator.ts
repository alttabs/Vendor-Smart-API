import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

const validator = createValidator();

const jobSchema = Joi.object({
  locationId: Joi.number().integer().required(),
  serviceCategoryId: Joi.number().integer().required(),
});

export const validateJob = validator.body(jobSchema);
