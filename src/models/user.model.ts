import mongoose, {Schema} from "mongoose";

export const userSchema = new Schema({
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
  isVarified: { type: Boolean, require: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", userSchema);
export { userModel };
