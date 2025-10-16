import { Types } from "mongoose";
// import { dbUsers } from "../db/app.database";
import { userModel } from "../models/user.model";
import { otpModel } from "../models/otp.model";
import { IPreRegister } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { customerModel } from "../models/customer.model";
import { uploadModel } from "../models/upload.model copy";
import { IUpload } from "../interface/upload.interface";

export class UserRepository {
  static createUser = async (user: IPreRegister) => {
    const response = await userModel.create(user);
    if (!response) return null;
    return response;
  };

  static createOtp = async (email: string, otp: string) => {
    const response = await otpModel.create({ email, otp });
    if (!response) return null;
    return response;
  };

  static otpVerify = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndDelete({ email, otp });
    if (!response) return null;
    return response;
  };

  static updateUser = async (userId: Types.ObjectId) => {
    const response = await userModel.findByIdAndUpdate(
      userId,
      {
        is_verified: true,
      },
      { new: true }
    );
    if (!response) return null;

    return response;
  };

  static requestOtp = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );
    return response;
  };

  static deleteUser = async (userId: string) => {
    const user = await userModel
      .findByIdAndDelete(userId)
      .select("-password,-__v");
    return user;
  };

  static getUserById = async (userId: Types.ObjectId) => {
    const user = await userModel.findById(userId).select("-password,-__v");
    return user;
  };

  static getUser = async (userId: Types.ObjectId) => {
    const users = await userModel
      .findOne({ _id: userId })
      .select("-password -__v");
    if (!users) return null;
    return users;
  };

  static findUserByEmail = async (email: string) => {
    const user = await userModel.findOne({ email });

    return user;
  };

  static async findUserById(userId: Types.ObjectId): Promise<any> {
    const response = await userModel.findById({ _id: userId });
    if (!response) return null;
    // if (!Types.ObjectId.isValid(id)) {
    //   throw throwCustomError("Invalid User ID", 406);
    // }
    return response;
  }
  static saveOtp = async (email: string, otp: string) => {
    const res = await otpModel.findOneAndUpdate(
      {
        email,
      },
      {
        otp,
        createdAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res;
  };
  static getOtp = async (email: string) => {
    const response = await otpModel.findOne({ email });
    if (!response) return null;
    return response;
  };

  static requestPasswordReset = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );
    return response;
  };

  static resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    is_verified = true
  ) => {
    const response = await userModel.findOneAndUpdate(
      { email },
      { password: newPassword, is_verified },
      { otp, createdAt: new Date(), new: true, upsert: true }
    );
    return response;
  };

  static async login(email: string, password: string): Promise<any> {
    const user = await userModel.findOne({ email, password });
    return user;
  }

  //Update Password
  static updatePassword = async (
    // id: Types.ObjectId,
    filter: any,
    update: any
  ) => {
    const response = await userModel.findByIdAndUpdate(filter, update, {
      new: true,
    });
    if (!response) return null;
    return response;
  };

  static profileUpdate = async (id: Types.ObjectId, update: any) => {
    const response = await userModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!response) return null;
    return response;
  };
  static updateProfile = async (
    id: Types.ObjectId,
    update: {
      firstName: string;
      lastName: string;
      imageFile?: string | undefined;
    }
  ): Promise<any> => {
    const response = await userModel.findOneAndUpdate(id, update, {
      new: true,
    });

    if (!response) return null;
    return response;
  };

  static picture = async (upload: IUpload): Promise<any> => {
    const response = await uploadModel.create({
      userId: upload.userId,
      filePath: upload.filePath,
    });
    if (!response) return null;
    return response;
  };

  static existingImage = async (userId: Types.ObjectId) => {
    const response = await uploadModel.findOne(userId);
    if (!response) return null;
    return response;
  };

  static updateImage = async (
    userId: Types.ObjectId,
    filePath: string
  ): Promise<any> => {
    const response = await uploadModel.findByIdAndUpdate(
      userId,
      { filePath },
      {
        new: true,
      }
    );
    if (!response) return null;
    return response;
  };

  //============================||VERIFY KYC ||=============================

  static async saveKyc(data: {
    dateOfBirth: string;
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) {
    const response = await userModel.findByIdAndUpdate(
      data.userId,
      {
        dateOfBirth: data.dateOfBirth,
        nin: data.nin,
        bvn: data.bvn,
      },
      { new: true }
    );
    if (!response) return null;
    return response;
  }
}
