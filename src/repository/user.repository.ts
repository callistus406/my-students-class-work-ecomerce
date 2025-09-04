import { Types } from "mongoose";
// import { dbUsers } from "../db/app.database";
import { userModel } from "../models/user.model";
import { otpModel } from "../models/otp.model";
import { IPreRegister } from "../interface/user.interface";

export class UserRepository {
  static createUser = async (user: IPreRegister) => {
    const response = await userModel.create(user);
    if (!response) return null;
    return response;
  };

  static createOtp = async ( email: string, otp: string) => {
    const response = await otpModel.create({ email, otp });
    if (!response) return null;
    return response;

  }

  static otpVerify = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndDelete({ email, otp });
    if (!response) return null;
    return response;
  };

  static updateUser = async (userId: Types.ObjectId) => {
    const response = await otpModel.findByIdAndUpdate(userId, {
      is_Varified: true,
    });

    return response;
  };

  static deleteUser = async (userId: string) => {
    const user = await userModel.findByIdAndDelete(userId).select("-password,-__v");
    return user;
  }

  static getUserById = async (userId: string) => {
    const user = await userModel.findById(userId).select("-password,-__v");
    return user;
  };

  static getUsers = async () => {
    const users = await userModel.find().select("-password,-__v");
    return users;
  };

  static findUserByEmail = async (email: string) => {
    const user = await userModel.findOne({ email }).select("-password,-__v");
    return user;
  };

  static async createotp(email: string, otp: string) {
    const res = await otpModel.create({ email, otp });
    return res;
  }

  static saveOtp = async (email: string, otp: string) => {
    const res = await otpModel.findOneAndUpdate(
      {
        email,
      },
      {
        otp, createdAt: new Date()
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res;
  };
}
