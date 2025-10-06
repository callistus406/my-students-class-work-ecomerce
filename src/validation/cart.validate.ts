import Joi from "joi";

export const cartItemValidate = Joi.object({
  productId: Joi.string().required(),
  merchantId: Joi.string().required(),
  productName: Joi.string().trim().min(2).max(100).required(),
  unitPrice: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  image: Joi.string().uri().required(),
});

export const cartValidate = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.string().min(1).required(),
  couponCode: Joi.string().optional(),
});

// productid;
// qty;
