import mongoose, {Schema} from "mongoose";

const walletSchema = new Schema({
   userId:{type: mongoose.Types.ObjectId, require:true, unique:true},
   accountNumber:{type:String, require:true, unique:true},
   walletName:{type:String, require:true, unique:true},
   balance:{type:Number, require:true, default:0},
   currency:{type:String, require:true, default:"NIG"},
   transaction:{type:Array, default:[]},
   createdAt:{type:Date, default:Date.now},
   updatedAt:{type:Date, default:Date.now}
})

export const Wallet = mongoose.model("Wallet", walletSchema);
