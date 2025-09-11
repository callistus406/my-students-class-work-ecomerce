import mongoose, { Schema } from "mongoose";

export const productSchema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    productName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: false },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, required: false },
    currency: { type: String, required: true },
    stock: { type: Number, required: true },
    quantity: { type: Number, required: true },
    ratingCount: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, max: 5 },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);
