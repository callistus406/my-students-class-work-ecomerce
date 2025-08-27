import mongoose, {Schema, Types } from "mongoose";

const transactionSchema = new Schema({
   id:{type: Types.ObjectId, require:true, unique:true},
   amount:{type:String, require:true},
   sender:{type:String, require:true},
   reciever:{type:String, require:true},
   status:{type:String, require:true},
   timeStamp:{type:Date, default:Date.now}
})

export const Transaction = mongoose.model("Transaction", transactionSchema);
