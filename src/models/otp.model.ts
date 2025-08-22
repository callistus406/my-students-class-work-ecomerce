import mongoose, { Types } from "mongoose";

const otpSchema = new mongoose.Schema({
   userId:{type: Types.ObjectId, require:true},
   email:{type:String, require:true},
   phoneNumber:{type:String, require:true},
   otp:{type:String, require:true},
   createdAt:{type:Date, default:Date.now},
   expiresAt:{type:Date, default:Date.now}
})

export const Otp = mongoose.model("Otp", otpSchema);
