import mongoose, { HydratedDocument, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, require: true },
        //image: { type: String, required: true },
      },
    ],
    couponCode: { type: String },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);

// type CartDocument = HydratedDocument<typeof cartModel>;
