import { Types } from "mongoose";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { IPreRegister, IRegister } from "../@types/user";
import { preRegisterSchema } from "../validation/user-schema";
import { newError } from "../midddleware/errorHandler.midleware";
import { UserRepository } from "../repository/User.repository";

const jwtSecret = process.env.JWT_ADMIN_KEY as string

export class UserService {
    static getUser = async ()  => {
        return await UserRepository.getUsers();
    };

    static preRegister = async(user:IPreRegister) => {
        const {error} = preRegisterSchema.validate(user)
        if(error){
         throw newError(error.message, 422)
        }

        const isExist = await UserRepository.fetchUserByEmail(user.email)
        if(isExist){
            throw newError("Login qith your regustered Email", 420)
        }


    };

    static register = async (user:IRegister) => {
        if(!user.firstName || !user.lastName || !user.email || !user.password) {
            throw new Error("All fields are required")
        }
        if(!user.email.includes("@")){
            throw new Error("inavlid email address")
        }
        if(user.password.length <3){
            throw new Error("Password cannot be less than three")
        }
        if(!/[!#$%<>&*()-+=?"@]/.test(user.password)){
            throw new Error("password must contain a symbol")
        }
        try {
             const isEmail = await UserRepository.fetchUserByEmail(user.email)
        if(isEmail){
            throw new Error("Email already exsit")
        }
        const hashedPassword = await  bcrypt.hash(user.password, 10)
        const newUser = {...user, password:hashedPassword}
        const response= await UserRepository.register(newUser)
        return response
        } catch (error:any) {
            throw new Error(error.message)
            
        }
       
    
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
        const response = await UserRepository.fetchUserByEmail(email)
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

    static login = async (email:string, password:string) => {
        if(!email || !password){
            throw new Error("Fields cannot be empty")
        }
        if (!email.includes("@")){
            throw new Error("Invalid Email")
        }
        
        const user = await UserRepository.fetchUserByEmail(email)
        
        if(!user){
            throw new Error("user does not exist")
        }

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid){
            throw new Error("Invalid username/password")
        }
        const payload = {
            username: user.username,
            email:user.email,
        }
        let jwtKey =  jwt.sign(payload, jwtSecret, {expiresIn:"1m"})
        return {
            message:"Successfully Loggedin",
            authKey:jwtKey,
        }
    
    }

    
}