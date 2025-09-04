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

  static otpVerify = async (email: string, otp: string) => {
    const response = await otpModel.findOne({ email, otp });
    if (!response) return null;
    return response;
  };

  static updateUser = async (userId: Types.ObjectId) => {
    const response = await otpModel.findByIdAndUpdate(userId, {
      is_Varified: true,
    });

    return response;
  };

  static getUsers = async () => {
    const users = await userModel.find().select("-password,-__v");
    return users;
  };

  static findUserByEmail = async (email: string) => {
    const user = await userModel.findOne({ email }).select("-password,-__v");
    return user;
  };

  static async findUserById(userId: Types.ObjectId) {
    const response = await userModel
      .findById({ userId })
      .select("-password, -__v");
    if (!response) return null;
    return response;
  }
  static saveOtp = async (email: string, otp: string) => {
    const res = await otpModel.findOneAndUpdate(
      {
        email,
      },
      {
        otp,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res;
  };
  static async login(email: string, password: string): Promise<any> {
    const user = await userModel.findOne({ email, password });
    return user;
  }
  //============================||VERIFY KYC ||=============================

  static async saveKyc(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) {
    const response = await userModel.findByIdAndUpdate(
      data.userId,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        nin: data.nin,
        bvn: data.bvn,
        is_verified: true,
      },
      { new: true }
    );
    if (!response) return null;
    return response;
  }

  //====================|| UPGRADE TO CUSTOMER OR MERCHANT ||==================
  static async upgradeRole(filter: any, update: any): Promise<any> {
    const response = await userModel.updateOne(filter, update, { new: true });
  }
}
