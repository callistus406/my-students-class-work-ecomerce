import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", require: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  rating: { type: Number, require: true, min: 1, max: 5 },
  comment: { type: String, require: false, maxlength: 1000 },
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const reviewModel = mongoose.model("Review", reviewSchema);
