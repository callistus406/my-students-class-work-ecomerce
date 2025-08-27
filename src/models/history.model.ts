import mongoose  from "mongoose";
import { ref } from "process";

const historySchema = new mongoose.Schema({
   transactionid:{type: mongoose.Types.ObjectId, require:true, unique:true},
   userId:{type:String, ref:"User", require:true},
   action:{type:String, require:true},
   timeStamp:{type:Date, default:Date.now}
})

export const History = mongoose.model("History", historySchema);
