import mongoose, { Schema, Types } from "mongoose";
import {Iotp} from "../interface/otp.interface";

const otpSchema: Schema<Iotp> = new mongoose.Schema({
   email:{type:String, require:true},
   otp:{type:Number, require:true},
   createdAt:{type:Date, default:Date.now},
   expiresAt:{type:Date, default:Date.now}
})

export const OTPModel = mongoose.model("Otp", otpSchema);

