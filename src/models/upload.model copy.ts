import mongoose, { Types } from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    require: true,
    unique: true,
    partialFilterExpression: {
      userId: { $exist: true, $ne: null },
    },
    ref: "User",
  },
  filePath: {
    type: String,
    require: true,
  },
  uploadedAt: { type: Date, default: Date.now() },
});

export const uploadModel = mongoose.model("Uploads", uploadSchema);
