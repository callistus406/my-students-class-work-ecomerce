import Joi from "joi";

export const productValidate = Joi.object({
  productName: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(500).allow(null, ""),
  price: Joi.number().min(0).required(),
  discountedPrice: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).required(),
  stock: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  avgRating: Joi.number().min(0).max(5).optional(),
  isActive: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});
