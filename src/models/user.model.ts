import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["merchant", "customer"],
    default: "customer",
  },
  otp: { type: String, require: true },
  dateOfBirth: {
    type: Date,
    require: true,
  },
  nin: {
    type: String,
  },
  bvn: {
    type: String,
  },
  is_verified: { type: Boolean, require: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", userSchema);
export { userModel };
