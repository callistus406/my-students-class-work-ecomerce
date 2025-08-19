import { Types } from "mongoose";
// import { dbUsers } from "../db/app.database";
import { userModel } from "../models/user.model";
import { response } from "express";


export interface IUsers {
    firstName: string,
    lastName: string
    email: string,
    phone: string,
    password: string,
    country: string
    company: string,
}



export class UserRepository {
    static getUsers = async () => {
        const users = await userModel.find()
        return users
    };

    static register = async (user: IUsers) => {
       
          const response =await userModel.create(user)
          if(!response) return null
        return response       
       
      
    };

    static fetchUserByEmail = async (email:string):Promise<any> => {
        const response = await userModel.findOne({email})
        return response;
    }

    static fetchUser = async (id: Types.ObjectId) => {
        const userId = await userModel.findById(id)
        if (!userId){
            throw new Error("No User found")
        };
        return userId;

    };

    static updateById = async (id:Types.ObjectId, updateData:any) =>{
        const user = await userModel.findByIdAndUpdate(id, updateData, {new:true})
        return user;
    };

    static updateByEmail = async (filter:any, update:any) => {
        const user = await userModel.findOneAndUpdate(filter, update, {new:true})
        return user;
    }

    static deletUser = async (id: Types.ObjectId) =>{
       const dltUser = await  userModel.findByIdAndDelete(id)
       if(!dltUser){
           throw new Error("User does not Exist")
       } 
        return dltUser;
    };

}