import mongoose, {Schema} from "mongoose";

export const productSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
  productName: { type: String, require: true },
  slug: { type: String, require: true, unique: true, index: true },
  description: { type: String, require: false },
  //categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, require: true },
  compareAtPrice: { type: Number, require: false },
  currency: { type: String, require: true },
  stock: { type: Number, require: true },
  //sku: { type: String, unique: true },
  images: [{ type: String,}],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0 , max: 5},
  ratingCount: { type: Number, default: 0 },
  quantity: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},
{ timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);
