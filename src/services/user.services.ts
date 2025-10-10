import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { scrypt, randomFill, createCipheriv } from "node:crypto";
import { promisify } from "node:util";
import crypto from "crypto";
import { otpModel } from "../models/otp.model";
import { JWT_SECRET, JWT_EXP, JWT_ADMIN_KEY } from "../config/system.variable";
import { UserRepository } from "../repository/user.repository";
import {
  loginValidate,
  preValidate,
  userValidate,
  kycValidate,
  updatePwd,
  profileSchema,
} from "../validation/user.validate";
import { IPreRegister, IVerifyUser } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otp-template";
import { confirmationTemplate } from "../utils/login-confirmation-template";
import { kycRecords } from "../utils/kyc-records";
import { CustomerRepository } from "../repository/customer-repository";
import { MerchantRepository } from "../repository/merchant-repository";
import { IEncrypt } from "../interface/encrypt-interface";
import { Multer } from "multer";
import { uploadModel } from "../models/upload.model copy";
import path from "node:path";

export class UserService {
  static preRegister = async (user: IPreRegister) => {
    //validate user input
    const { error } = preValidate.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }
    user.firstName = user.firstName.toLowerCase();
    user.lastName = user.lastName.toLowerCase();
    user.email = user.email.toLowerCase();

    // check if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound)
      throw throwCustomError("Sorry, you can not use this email", 409);

    // verify account state
    if (isFound && !user.is_verified)
      throw throwCustomError("Please verify your account", 400);
    // generate password
    const hashedPassword = await bcrypt.hash(user.password, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    // if user  does not exist  create user
    const response = await UserRepository.createUser({
      ...user,
      password: hashedPassword,
      is_verified: false,
    });
    if (!response) throw throwCustomError("Unable to create account", 500);

    // gen role
    if (response.role === "customer") {
      const role = await CustomerRepository.createCustomer(response._id);
      if (!role) {
        throw throwCustomError("Unable to create a Customer account", 423);
      }
    }
    if (response.role === "merchant") {
      const merchantRole = MerchantRepository.createMerchant(response._id);
      if (!merchantRole) {
        throw throwCustomError("Unable to create a Merchant account", 423);
      }
    }

    // gen otp
    const otp = await UserService.generateOtp(user.email);
    if (!otp) {
      throw throwCustomError("OTP generation failed", 400);
    }
    //hash otp
    // save otp
    const saveOtp = await UserRepository.saveOtp(user.email, otp.toString());

    if (!saveOtp) {
      return "Account created, Successfully, please request for OTP to continue";
    }
    // send otp via mail
    sendMail(
      {
        email: user.email,
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.lastName} ${user.firstName}`,
        },
      },
      otpTemplate
    );

    // send response to the user

    return "Account created, Successfully. Please check your email for OTP to continue";
  };

  static Register = async (user: IVerifyUser) => {
    const { error } = userValidate.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    // get email form db
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (!isFound) {
      throw throwCustomError("Invalid account", 404);
    }

    //compare otp
    const compareOtp = await UserRepository.getOtp(user.email);
    if (!compareOtp || compareOtp.otp !== user.otp) {
      throw throwCustomError("Invalid OTP", 400);
    }
    // verify otp
    const isOtpValid = await UserRepository.otpVerify(user.email, user.otp);
    //confirm account

    //verify otp
    if (!isOtpValid || isOtpValid.otp !== user.otp) {
      throw throwCustomError("Invalid OTP", 400);
    }

    await UserRepository.updateUser(isFound._id);

    return "Account is verified, You can now login";
  };

  static async generateOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999);
    await otpModel.create({ email, otp });
    const savedOtp = await UserRepository.saveOtp(email, otp.toString());
    if (!savedOtp) {
      throw throwCustomError("Unable to generate OTP", 500);
    }

    return otp;
  }

  // request otp
  static requestOtp = async (email: string) => {
    if (!email) throw throwCustomError("Email is required", 400);
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw throwCustomError("User not found", 404);

    const otp = await UserService.generateOtp(email);
    console.log("do not share with anyone", otp);
    if (!otp) throw throwCustomError("Unable to generate OTP", 500);
    // send otp via mail
    sendMail(
      {
        email: email,
        subject: "REQUEST OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate
    );

    return "OTP sent to your email";
  };

  //request reset password {email to send to recieve otp}

  static requestPasswordReset = async (email: string) => {
    //TODO: use joi for validation
    if (!email) throw throwCustomError("Email is required", 400);

    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw throwCustomError("User not found", 404);

    const otp = await UserService.generateOtp(email);

    if (!otp) throw throwCustomError("Unable to generate OTP", 500);

    const hashedotp = await bcrypt.hash(otp.toString(), 2);

    if (!hashedotp) throw throwCustomError("OTP hashing failed", 500);
    // send otp via mail
    sendMail(
      {
        email: email,
        subject: "REQUEST PASSWORD RESET",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate
    );

    return "OTP sent to your email";
  };

  //reset password

  static resetPassword = async (
    email: string,
    otp: string,

    newPassword: string
  ) => {
    if (!email || !otp || !newPassword) {
      throw throwCustomError("All fields are required", 400);
    }

    const isOtpValid = await UserRepository.otpVerify(email, otp);
    if (!isOtpValid) {
      throw throwCustomError("Invalid OTP", 400);
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) {
      throw throwCustomError("Password hashing failed", 500);
    }
    const response = await UserRepository.resetPassword(
      email,
      otp,
      hashedPassword
    );
    if (!response) {
      throw throwCustomError("Unable to reset password", 500);
    }

    return "Password reset successfully";
  };

  static getUser = async (userId: Types.ObjectId) => {
    // const objectId = new mongoose.Types.ObjectId(userId)
    const response = await UserRepository.getUserById(userId);
    if (!response) {
      throw throwCustomError("unable to perform operation", 422);
    }
    return response;
  };

  static login = async (
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<any> => {
    //validate email/password
    const { error } = loginValidate.validate({ email, password });
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    email = email.toLowerCase();
    //check if user exist
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      throw throwCustomError("user does not exist", 429);
    }
    //check password validity
    const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword)
      throw throwCustomError("Invalid email or password", 400);

    const payload = {
      userId: user._id,
    };

    let jwtKey = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP } as any);
    if (!jwtKey) {
      throw throwCustomError("Unable to Login", 500);
    }
    sendMail(
      {
        email: email,
        subject: "Login Confirmation",
        emailInfo: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          name: `${user.lastName} ${user.firstName}`,
        },
      },
      confirmationTemplate
    );
    return {
      message: `Dear ${user.firstName}, You've successfully Loggedin`,
      authKey: jwtKey,
    };
  };

  // =====================|| KYC VERIFICATION ||=========================

  static async verifyKyc(data: {
    dateOfBirth: string;
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) {
    const { dateOfBirth, nin, bvn, userId } = data;

    const { error } = kycValidate.validate({
      dateOfBirth: data.dateOfBirth,
      nin: data.nin,
      bvn: data.bvn,
    });
    if (error) {
      throw throwCustomError(error.message, 410);
    }
    //check if user exist
    const user = await UserRepository.findUserById(data.userId);
    if (!user) {
      throw throwCustomError("no record found", 422);
    }
    // check if user is already verified
    if (user.is_verified) {
      throw throwCustomError(
        `Your ${user.role.toUpperCase()} account is already verified`,
        412
      );
    }
    //call external API
    const isUser = kycRecords.find(
      (item) =>
        item.firstName.toLowerCase() === user.firstName &&
        item.lastName.toLowerCase() === user.lastName
    );
    if (!isUser) {
      throw throwCustomError("No record found", 403);
    }
    //check dateofbirth
    const isDob = kycRecords.find(
      (x) =>
        x.dateOfBirth === data.dateOfBirth &&
        x.firstName.toLowerCase() === user.firstName &&
        x.lastName.toLowerCase() === user.lastName
    );
    if (!isDob) {
      throw throwCustomError("Invalid credentials", 403);
    }
    //check NIN authentication
    const isNinValid = kycRecords.find(
      (result) =>
        result.nin === data.nin &&
        result.firstName.toLowerCase() === user.firstName &&
        result.lastName.toLowerCase() === user.lastName
    );
    if (!isNinValid) {
      throw throwCustomError("Invalid NIN", 403);
    }
    //Encrypt Nin
    const encrypt = await UserService.encryptData(data.nin);
    if (!encrypt) {
      throw throwCustomError("unable to encrypt file", 422);
    }
    //check BVN authentication
    const isBvnValid = kycRecords.find(
      (result) =>
        result.bvn === data.bvn &&
        result.firstName.toLowerCase() === user.firstName &&
        result.lastName.toLowerCase() === user.lastName
    );
    if (!isBvnValid) {
      throw throwCustomError("Invalid BVN", 402);
    }

    // Encrypt Bvn
    const encryptBvn = await UserService.encryptData(data.bvn);
    if (!encrypt) {
      throw throwCustomError("unable to encrypt file", 422);
    }

    const validate = await UserRepository.saveKyc({
      dateOfBirth,
      nin: encrypt,
      bvn: encryptBvn,
      userId,
    });
    if (!validate) {
      throw throwCustomError("Unable to verify KYC", 422);
    }
    return `Your ${user.role.toUpperCase()} account has been Verified`;
  }
  //Update password
  static updatePassword = async (
    userId: Types.ObjectId,
    password: string,
    update: {
      password: string;
      confirmPassword: string;
    }
  ) => {
    const { error } = updatePwd.validate(update);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    // check user auth
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw throwCustomError("Invalid record found", 422);
    }
    //compare password
    const isPwdValid = await bcrypt.compare(password, user.password);
    if (!isPwdValid) {
      throw throwCustomError("Invalid Password", 422);
    }
    if (update.confirmPassword.trim() !== update.password.trim()) {
      throw throwCustomError("password must match", 422);
    }
    user.password = await bcrypt.hash(update.confirmPassword, 10);
    await user.save();
    return "Password has been Updated";
  };
  // profile update
  static profileUpdate = async (
    id: Types.ObjectId,
    password: string,
    update: any,
    updated: any,
    path: string | undefined
  ) => {
    //validate fields
    const { error } = profileSchema.validate(update, updated);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    //validate user
    const user = await UserRepository.findUserById(id);
    console.log("user is:", user);
    if (!id) {
      throw throwCustomError("No user found", 422);
    }
    //password authentication
    const isPwdAuth = await bcrypt.compare(password, user.password);
    if (!isPwdAuth) {
      throw throwCustomError("Enter the correct password", 422);
    }
    if (user) {
      const { error } = profileSchema.validate(updated);
      if (error) {
        throw throwCustomError(error.message, 422);
      }

      //check the role of the user
      if (user.role === "customer") {
        //find the customer account of the user
        const userId = await CustomerRepository.findCustomer(id);
        if (!userId) {
          throw throwCustomError("Invalid user", 422);
        }
        //update customer
        const user = await CustomerRepository.update(userId, updated);
        if (!user) {
          throw throwCustomError("Unable to update customer profile", 422);
        }
      }
      //check the role of the user
      if (user.role === "merchant") {
        //find the merchant account of the user
        const userId = await MerchantRepository.findMerchant(id);
        if (!userId) {
          throw throwCustomError("Invalid user", 422);
        }
        //update merchant
        const user = await MerchantRepository.update(userId, updated);
        if (!user) {
          throw throwCustomError("Unable to update merchant profile", 422);
        }
      }
    }

    //profile should be updated
    const response = await UserRepository.profileUpdate(id, update);
    if (!response) {
      throw throwCustomError("Unable to save changes", 422);
    }
    //image optional
    if (path) {
      const domain = `http://localhost:8080/uploads/${path}`;
      const res = await UserRepository.picture({
        userId: user.id,
        filePath: domain,
      });
    }

    return {
      message: "Profile updated",
      filePath: path,
    };
  };

  //===================|| ENCRYPT ||=========================== //
  static encryptData = async (text: string) => {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };
}
