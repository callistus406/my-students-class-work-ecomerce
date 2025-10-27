import mongoose, { HydratedDocument, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    items: [],
    couponCode: { type: String },
    totalPrice: { type: Number, require: true },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);

// type CartDocument = HydratedDocument<typeof cartModel>;
