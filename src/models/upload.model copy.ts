import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  filePath: {
    type: String,
    require: true,
  },
});

export const uploadModel = mongoose.model("Uploads", uploadSchema);
