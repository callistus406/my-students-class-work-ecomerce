import { Types } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserRepository } from "../repository/user.repository";
import {userSchema} from "../validation/user.validate"
import { IUsers } from "../interface/user.interface";

export class UserService {

    static Register = async (user: IUsers) => {
        if(!user){
            throw new Error("Invalid user data");
        }

        
        const { error } = userSchema.validate(user);
        if (error) {
            console.error("Validation error:", error.message);
            throw new Error("Invalid input: " + error.message);
        }


  const isFound = await UserRepository.findUserByEmail(user.email);
  if (isFound) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  if (!hashedPassword) {
    throw new Error("Password hashing failed");
  }

  const response = await UserRepository.register({
    ...user,
    password: hashedPassword,
  });

  if (!response) {
    throw new Error("User registration failed");
  }

  return response;
};


      static getUser = async ()  => {
        return await UserRepository.getUsers();
    };

    static fetchUser = async (id: string) => {
        if(!id){
            throw new Error("Invalid id")
        }
        const convId = new Types.ObjectId(id)
        const response = await UserRepository.fetchUser(convId)
        
        return response;

    };

    static fetchUserByEmail = async (email:string)=>{
        if(!email) return null
        if(!email.includes("@")){
            throw new Error("Invalid email address")
        }
        const response = await UserRepository.findUserByEmail(email)
        if(!response){
            throw new Error("user not found")
        }
        return response;
    };

    static updateById = async (id: string, updateData:any) => {
        if(!id){
            throw new Error("ENter a valid input")
        }
        const mongoId = new Types.ObjectId(id)
        const userId = await UserRepository.updateById(mongoId, updateData)
      return userId;
    };

    static updateByEmail = async (email:string, country:any) =>{
        const filter = {email}
        const update = {country}
        if(!filter){
            throw new Error("Email not found")
        }
        if(!email.includes("@")){
            throw new Error("Enter a Valid email address")
        }
        const response = await UserRepository.updateByEmail(filter, update)
        return response
    }

    static deleteUser = async (id: string) => {
        if(!id){
            throw new Error("Invalid Id")
        }
        const convId = new Types.ObjectId(id)
        const response = await UserRepository.deletUser(convId)
        return response;
    };

    // static login = async (email:string, password:string) => {
    //     if(!email || !password){
    //         throw new Error("Fields cannot be empty")
    //     }
    //     if (!email.includes("@")){
    //         throw new Error("Invalid Email")
    //     }
        
    //     const user = await UserRepository.findUserByEmail(email)
        
    //     if(!user){
    //         throw new Error("user does not exist")
    //     }

    //     const isValid = await bcrypt.compare(password, user.password)
    //     if(!isValid){
    //         throw new Error("Invalid username/password")
    //     }
    //     const payload = {
    //         username: user.username,
    //         email:user.email,
    //     }
    //     let jwtKey =  jwt.sign(payload, jwtSecret, {expiresIn:"1m"})
    //     return {
    //         message:"Successfully Loggedin",
    //         authKey:jwtKey,
    //     }
    
    // }

    
}