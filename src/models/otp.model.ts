import mongoose, { Schema, Types } from "mongoose";
import {Iotp} from "../interface/otp.interface";

const otpSchema: Schema<Iotp> = new mongoose.Schema({
   email:{type:String, required:true},
   otp:{type:String, required:true},
   createdAt:{type:Date, default:Date.now},
   expiresAt:{type:Date, default:Date.now}
})

export const OTPModel = mongoose.model("Otp", otpSchema);

