import Joi from "joi";

export const productValidate = Joi.object({
  merchantId: Joi.string().required(),
  productName: Joi.string().trim().min(2).max(100).required(),
  slug: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(10).max(500).allow(null, ''),
  price: Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).optional(),
  currency: Joi.string().trim().length(3).required(),
  stock: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  avgRating: Joi.number().min(0).max(5).optional(),
  isActive: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  sku: Joi.string().alphanum().min(3).max(30).optional(),
  //categoryId: Joi.string().optional(),
  ratingCount: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string().valid("electronics", "clothing", "food")).optional(),
});

