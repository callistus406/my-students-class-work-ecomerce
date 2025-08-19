
import mongoose, {Schema, Types } from "mongoose";

const userSchema = new Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

export const userModel = mongoose.model("User", userSchema)