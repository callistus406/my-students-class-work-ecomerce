import mongoose, { Schema } from "mongoose";

export const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    currency: { type: String, required: true },
    stock: { type: Number, required: true },
    quantity: { type: Number, required: true },
    avgRating: { type: Number, default: 0, max: 5 },
    sku: { type: String, unique: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);
