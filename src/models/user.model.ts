import mongoose, { Schema, Types } from "mongoose";

export enum USER_TYPE {
  CUSTOMER = "customer",
  MERCHANT = "merchant",
}
export const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["customer", "merchant"],
  },
  otp: { type: String, require: true },
  dateOfBirth: {
    type: String,
  },
  nin: {
    type: String,
  },
  bvn: {
    type: String,
  },

  is_kyc_verified: { type: Boolean, require: true, default: false },

  ProfileImageId: {
    type: Types.ObjectId,
    ref: "Uploads",
  },
  is_verified: { type: Boolean, require: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", userSchema);
export { userModel };
