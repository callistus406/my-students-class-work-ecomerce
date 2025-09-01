import Joi from "joi";

export const preValidate = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("merchant", "customer").required(),
});

export const userValidate = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});
