import Joi from "joi";

export const cartItemValidate = Joi.object({
 productId: Joi.string().required(),
  merchantId: Joi.string().required(),
  productName: Joi.string().trim().min(2).max(100).required(),
  unitPrice: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  //image: Joi.string().uri().required(),
});

export const cartValidate = Joi.object({
  items: Joi.array().items(cartItemValidate).min(1).required(),
  couponCode: Joi.string().optional(),
  currency: Joi.string().trim().required(),
  totalPrice: Joi.number().positive().required(),
});
