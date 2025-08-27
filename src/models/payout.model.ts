import mongoose, {Schema} from "mongoose";

export const payoutSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  merchantId: { type: Schema.Types.ObjectId, ref: "Merchant", require: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", require: true },
  periodStart: { type: String, require: true },
  periodEnd: { type: String, require: true },
  grossSale: { type: Number, require: true },
  refund: { type: Number, require: true },
  fees: { type: Number, require: true },
  netAmount: { type: Number, require: true },
  currency: { type: String, require: true, maxLength: 3 },
  status: { type: String, require: true, enum: ["pending", "paid", "failed", "in_progress"] },
  paymentMethod: { type: String, require: true, enum: ["mock", "paypal", "flutterwave", "stripe"] },
  settleRef: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const payoutModel = mongoose.model("Payout", payoutSchema);
