import Joi from "joi";

export const preValidate = Joi.object({
  firstName: Joi.string().min(2).max(30).required().trim(),
  lastName: Joi.string().min(2).max(30).required().trim(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .trim()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/
    )
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 7 characters",
    })
    .required(),
  role: Joi.string().valid("customer", "merchant").required().trim(),
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
  dateOfBirth: Joi.string().required(),
  nin: Joi.string().length(11).required(),
  bvn: Joi.string().length(11).required(),
});

export const resetValidate = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  newPassword: Joi.string()
    .required()
});

export const profileSchema = Joi.object({
  firstName: Joi.string().optional().trim().min(2),
  lastName: Joi.string().optional().min(2).trim(),
  displayName: Joi.string().optional().min(2),
  address: Joi.string().optional().min(5),
  phoneNumber: Joi.string().optional().min(11),

  path: Joi.string().optional(),
});

export const updatePwd = Joi.object({
  password: Joi.string()
    .trim()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^&*)(=+|)]).+$/)
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    }),
  confirmPassword: Joi.string()
    .required()
    .trim()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^&*)(=+|)]).+$/)
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    }),
});
