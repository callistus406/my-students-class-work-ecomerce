import { Types } from "mongoose";
// import { dbUsers } from "../db/app.database";
import {userModel} from "../models/user.model"
import {OTPModel} from "../models/otp.model"
import { preRegister, IUsers } from "../interface/user.interface";


export class UserRepository {

  static preRegister = async (user: preRegister, is_verified: boolean) => {
    const response = new userModel({
      ...user,
      is_verified: is_verified
    });
    return response;
  }

    static register = async (user: IUsers) => {
          const response =await userModel.create(user)
          if(!response) return null
        return response
    };

    static otpVerify = async (email: string, otp: number) => {
      const response = await OTPModel.findOne({ email, otp });
      return response;
    };

      static getUsers = async () => {
        const users = await userModel.find()
        return users
    };

    static findUserByEmail = async (email: string) => {
      const user = await userModel.findOne({ email });
      return user;
    };
}