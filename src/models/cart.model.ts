import mongoose, {Schema} from "mongoose";

 const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
      merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
      productName: { type: String, require: true },
      unitPrice: { type: Number, require: true },
      quantity: { type: Number, require: true, min: 1 },
      image: { type: String, require: true },
    },
  ],
  couponCode: { type: String, require: false },
  currency: { type: String, require: true },
  totalPrice: { type: Number, require: true },
}, 
{ timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);
