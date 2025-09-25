import mongoose, {Schema} from "mongoose";

 const cartSchema = new Schema({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
      merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
      productName: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      //image: { type: String, required: true },
    },
  ],
  couponCode: { type: String, required: false },
  currency: { type: String, required: true },
  totalPrice: { type: Number, required: true },
}, 
{ timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);
