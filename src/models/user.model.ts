
import mongoose, {Schema, Types } from "mongoose";

const userSchema = new Schema({
    id:{type:Types.ObjectId, require:true, unique:true},
    title:{type:String, require:true},
    firstName:{type:String, require:true},
    lastName:{type:String, require:true},
    gender:{type:String, require:true},
    date_of_birth:{type:Date, require:true},
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:true
    },
    city:{type:String, require:true},
    state:{type:String, require:true},
    country:{type:String, require:true},
    zipCode:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        require:true
    },
    occupation:{type:String, require:true},
    accountNumber:{type:String, require:true},
    role:{
        type:String,
        require:true
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