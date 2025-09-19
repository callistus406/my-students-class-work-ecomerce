import Joi from "joi";

export const preValidate = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  password: Joi.string()
    .min(7)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[!@#$^&*)(=+|)])+$/)
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 7 characters",
    })
    .required(),
});

export const userValidate = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export const loginValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

export const kycValidate = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  nin: Joi.string().length(11).required(),
  bvn: Joi.string().length(11).required(),
});
