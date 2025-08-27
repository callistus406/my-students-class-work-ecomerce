import mongoose, {Schema} from "mongoose";

export const productSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
  name: { type: String, require: true },
  slug: { type: String, require: true, unique: true },
  description: { type: String, require: false },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, require: true },
  compareAtPrice: { type: Number, require: false },
  currency: { type: String, require: true },
  stock: { type: Number, require: true },
  sku: { type: String, require: true, unique: true },
  images: [{ type: String, require: true }],
  tags: [{ type: String, require: false }],
  isActive: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0 , max: 5},
  ratingCount: { type: Number, default: 0 },
  quantity: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const productModel = mongoose.model("Product", productSchema);
