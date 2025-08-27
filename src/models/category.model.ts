import mongoose, { Schema, Types } from "mongoose";

export const categorySchema = new Schema({
  id: { type: Types.ObjectId, require: true, unique: true },
  name: { type: String, require: true },
  slug: { type: String, require: true, unique: true },
  description: { type: String, require: true },
  parentId: { type: Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const categoryModel = mongoose.model("Category", categorySchema);
