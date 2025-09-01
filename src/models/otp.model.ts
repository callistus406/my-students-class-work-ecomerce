import mongoose, { Schema, Types } from "mongoose";

const otpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  //   expiresAt: { type: Date, default: Date.now },
});

export const otpModel = mongoose.model("Otp", otpSchema);

// export const userSchema = new Schema({
//   firstName: { type: String, require: true },
//   lastName: { type: String, require: true },
//   email: { type: String, require: true, unique: true },
//   password: { type: String, require: true },
//   role: {
//     type: String,
//     enum: ["merchant", "customer"],
//     default: "customer",
//   },
//   otp: { type: String, require: true },
//   is_verified: { type: Boolean, require: true, default: false },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const userModel = mongoose.model("User", userSchema);
// export { userModel };
