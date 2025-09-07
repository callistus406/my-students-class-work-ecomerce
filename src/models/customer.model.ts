import mongoose, { Schema, Types } from "mongoose";

const customerSchema = new Schema(
  {
    userId: { type: Types.ObjectId, require: true, unique: true, ref: "User" },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    phoneNumber: {
      type: Number,
      require: true,
      partialFilterExpression: {
        phone_number: { $exist: true, $ne: null },
      },
    },
    addresses: {
      label: { type: String },
      street: { type: String, require: true },
      city: { type: String, require: true },
      state: { type: String, require: true },
      country: { type: String, require: true },
      postalCode: { type: String },
      phone: { type: String },
      isDefault: { type: Boolean },
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const customerModel = mongoose.model("Customer", customerSchema);
