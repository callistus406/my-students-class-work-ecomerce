import mongoose from "mongoose";

export const mongoConnection = async() => {
    try {
         await mongoose.connect(`${process.env.DB_URI}`);
         console.log("database connected")
    } catch (error) {
        console.log("database disconnected")
        
    }
   
}