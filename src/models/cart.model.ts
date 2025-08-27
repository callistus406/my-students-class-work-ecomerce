import mongoose, {Schema} from "mongoose";

export const cartSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
      merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
      name: { type: String, require: true },
      unitPrice: { type: Number, require: true },
      quantity: { type: Number, require: true, min: 1 },
      image: { type: String, require: true },
    },
  ],
  couponCode: { type: String, require: false },
  currency: { type: String, require: true },
  totalPrice: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const cartModel = mongoose.model("Cart", cartSchema);
