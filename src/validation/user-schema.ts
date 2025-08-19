import Joi from "joi"

export const preRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})