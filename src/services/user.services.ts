import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { otpModel } from "../models/otp.model";
import {JWT_SECRET,JWT_EXP,JWT_ADMIN_KEY} from "../config/system.variable";
import { UserRepository } from "../repository/user.repository";
import {
  loginValidate,
  preValidate,
  userValidate,
  kycValidate,
} from "../validation/user.validate";
import { IPreRegister, IVerifyUser } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otp-template";
import { confirmationTemplate } from "../utils/login-confirmation-template";
import { kycRecords } from "../utils/kyc-records";
import { CustomerRepository } from "../repository/customer-repository";
import { MerchantRepository } from "../repository/merchant-repository";

export class UserService {
  static preRegister = async (user: IPreRegister) => {
    //validate user input
    const { error } = preValidate.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    // check if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound)
      throw throwCustomError("Sorry, you cannnot use this email", 409);

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
      throw throwCustomError("Invalid OTP111", 400);
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
    console.log("Generated OTP:", otp);
    // save otp

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
    if (!email) throw throwCustomError("Email is required", 400);
    const user = await UserRepository.findUserByEmail(email);
    if (!user) throw throwCustomError("User not found", 404);

    const otp = await UserService.generateOtp(email);
    console.log("do not share with anyone", otp);
    if (!otp) throw throwCustomError("Unable to generate OTP", 500);

    const hashedotp = await bcrypt.hash(otp.toString(), 2);
    console.log(hashedotp);
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

  static getUser = async () => {
    return await UserRepository.getUsers();
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
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nin: string;
    bvn: string;
    userId: Types.ObjectId;
  }) {
    const { firstName, lastName, dateOfBirth, nin, bvn, userId } = data;

    const { error } = kycValidate.validate({
      firstName: data.firstName,
      lastName: data.lastName,
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
        `Your ${user.role} account is already verified`,
        412
      );
    }

    const hashNin = await bcrypt.hash(data.nin, 5);
    if (!hashNin) {
      throw throwCustomError("Unable to complete request", 422);
    }

    const hashBvn = await bcrypt.hash(data.bvn, 5);
    if (!hashBvn) {
      throw throwCustomError("Unable to complete request", 422);
    }

    //call external API
    const isUser = kycRecords.find(
      (item) =>
        item.firstName.toLowerCase() === data.firstName &&
        item.lastName.toLowerCase() === data.lastName
    );
    if (!isUser) {
      throw throwCustomError("No record found", 403);
    }
    //check dateofbirth
    const isDob = kycRecords.find(
      (x) =>
        x.dateOfBirth === data.dateOfBirth &&
        x.firstName.toLowerCase() === data.firstName &&
        x.lastName.toLowerCase() === data.lastName
    );
    if (!isDob) {
      throw throwCustomError("Invalid credentials", 403);
    }
    //check NIN authentication
    const isNinValid = kycRecords.find(
      (result) =>
        result.nin === data.nin &&
        result.firstName.toLowerCase() === data.firstName &&
        result.lastName.toLowerCase() === data.lastName
    );
    if (!isNinValid) {
      throw throwCustomError("Invalid NIN", 403);
    }
    //check BVN authentication
    const isBvnValid = kycRecords.find(
      (result) =>
        result.bvn === data.bvn &&
        result.firstName.toLowerCase() === data.firstName &&
        result.lastName.toLowerCase() === data.lastName
    );
    if (!isBvnValid) {
      throw throwCustomError("Invalid BVN", 402);
    }

    //KYC should be approved
    const validate = await UserRepository.saveKyc({
      firstName,
      lastName,
      dateOfBirth,
      nin: hashNin,
      bvn: hashBvn,
      userId,
    });

    if (!validate) {
      throw throwCustomError("Unable to verify KYC", 422);
    }
    return `Your ${user.role} account has been Verified`;
  }
}
