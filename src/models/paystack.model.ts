import mongoose, { Schema } from "mongoose";

const paystackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", require: true },
  periodStart: { type: String, require: true },
  periodEnd: { type: String, require: true },
  grossSale: { type: Number, require: true },
  refund: { type: Number, require: true },
  fees: { type: Number, require: true },
  netAmount: { type: Number, require: true },
  currency: { type: String, require: true, maxLength: 3 },
  status: {
    type: String,
    require: true,
    enum: ["pending", "paid", "failed", "in_progress"],
  },
  paymentMethod: {
    type: String,
    require: true,
    enum: ["mock", "paypal", "flutterwave", "stripe"],
  },
  reference: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const payoutModel = mongoose.model("Paystack", paystackSchema);
