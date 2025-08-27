import mongoose,{Schema} from "mongoose";

export const orderSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
      merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
      productName: { type: String, require: true },
      unitPrice: { type: Number, require: true },
      quantity: { type: Number, require: true, min: 1 },
      price: { type: Number, require: true },
      status: { type: String, require: true, enum: ["pending","paid", "shipped", "delivered","cancelled","returned","packed"] },
    },
  ],
  subTotal: { type: Number, require: true },
  discount: { type: Number, require: false },
  shippingFee: { type: Number, require: true },
  tax: { type: Number, require: true },
  totalAmount: { type: Number, require: true },
  couponCode: { type: String, require: false },
  paymentRef: { type: String, require: false },
  paymentMethod: { type: String, require: false, enum: ["mock", "paypal", "flutterwave", "stripe"] },
  Status: { type: String, require: true, enum: ["pending", "completed", "partially_shipped", "shipped","cancelled","delivered","returned"] },
    shippingAddress: {
        street: { type: String, require: true },
        city: { type: String, require: true },
        state: { type: String, require: true },
        country: { type: String, require: true },
        postalCode: { type: String, require: true },
    }, 
  currency: { type: String, require: true },
  totalPrice: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", orderSchema);
