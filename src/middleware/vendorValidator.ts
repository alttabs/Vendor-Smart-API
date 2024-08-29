import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

const validator = createValidator();

const vendorSchema = Joi.object({
  name: Joi.string().required(),
  locationId: Joi.number().integer().required(),
  serviceCategoryIds: Joi.array().items(Joi.number().integer()).required(),
  isCompliant: Joi.boolean().required(),
});

export const validateVendor = validator.body(vendorSchema);
