import mongoose, { Schema, Types } from "mongoose";
import { timeStamp } from "node:console";

const merchantSchema = new Schema({
userId:{
    type:Types.ObjectId,
    require:true, 
    unique:true,
    ref:"User"
},
displayName:{
     type:String,
    require:true
   
},
slug:{ 
    type:String,
    require:true
},
bio:{
    type:String
},
logoUrl:{
    type:String
},
email:{
    type:String
},
phone:{
    type:String
},
addresses:{
_Id:{type:Types.ObjectId},
label:{type:String},
street:{type:String, require:true},
city:{type:String, require:true},
state:{type:String, require:true},
country:{type:String, require:true},
postalCode:{type:String,},
phone:{type:String},
isDefault:{type:Boolean},
},
payout:{
    type:Object,
    method:["BANK", "WALLET"]
},
isActive:{
    type:Boolean, default:true
},
createdAt:{
    type:Date
},
updatedAt:{
    type:Date
},

}, 
{
    timestamps:true
}
)

const merchantModel = mongoose.model("Merchant", merchantSchema)