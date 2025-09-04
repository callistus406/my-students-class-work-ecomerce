import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { JWT_ADMIN_KEY } from "../config/system.variable";
import crypto from "crypto";
import { userModel } from "../models/user.model";
import { otpModel } from "../models/otp.model";
import { customer } from "../models/customer.model";
import { merchant } from "../models/merchant.model ";
import { UserRepository } from "../repository/user.repository";
import {
  loginValidate,
  preValidate,
  userValidate,
  validateKyc,
} from "../validation/user.validate";
import { IPreRegister, IVerifyUser } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otp-template";
import { confirmationTemplate } from "../utils/login-confirmation-template";
import { kycRecords } from "../utils/kyc-records";

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
    if (isFound && !user.isVerified)
      throw throwCustomError("Please verify your account", 400);
    // generate password
    const hashedPassword = await bcrypt.hash(user.password, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    // if user  does not exist  create user
    const response = await UserRepository.createUser({
      ...user,
      password: hashedPassword,
      isVerified: false,
    });
    if (!response) throw throwCustomError("Unable to create account", 500);
    // gen otp
    const otp = await UserService.generateOtp(user.email);
    if (!otp) {
      throw throwCustomError("OTP generation failed", 400);
    }

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

    return otp;
  }

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

    const jwtSecret = process.env.JWT_ADMIN_KEY as string;

    let jwtKey = jwt.sign(payload, jwtSecret, { expiresIn: "20m" } as any);
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

    //check if user exist
    const user = await UserRepository.findUserById(data.userId);
    if (!user) {
      throw throwCustomError("no record found", 422);
    }
    //check if user is already verified
    if (user.is_verified) {
      throw throwCustomError("Your account is already verified", 412);
    }
    const { error } = validateKyc.validate({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      nin: user.nin,
      bvn: user.bvn,
    });
    if (error) {
      throw throwCustomError(error.message, 409);
    }
    //call external API
    const isUser = kycRecords.find(
      (item) =>
        item.firstName === user.firstName && item.lastName === user.lastName
    );
    if (!isUser) {
      throw throwCustomError("No record found", 403);
    }
    //check dateofbirth
    const isDob = kycRecords.find(
      (result) => result.dateOfBirth === dateOfBirth
    );
    if (!isDob) {
      throw throwCustomError("Invalid credentials", 403);
    }
    //check NIN authentication
    const isNinValid = kycRecords.find(
      (result) =>
        result.nin === nin &&
        result.firstName === user.firstName &&
        result.lastName === user.lastName
    );
    if (!isNinValid) {
      throw throwCustomError("Invalid NIN", 402);
    }
    //check BVN authentication
    const isBvnValid = kycRecords.find(
      (result) =>
        result.bvn === bvn &&
        result.firstName === user.firstName &&
        result.lastName === user.lastName
    );
    if (!isBvnValid) {
      throw throwCustomError("Invalid BVN", 402);
    }

    //KYC should be approved
    const validate = await UserRepository.saveKyc({
      firstName,
      lastName,
      dateOfBirth,
      nin,
      bvn,
      userId,
    });
    //check email validity
    // const isEmail = await UserRepository.findUserByEmail(email);
    // if (!isEmail) {
    //   throw throwCustomError("Invaliid email", 402);
    // }
    // const filter = { email };
    // //Update Role
    // if (isEmail) {
    //   if (user.role !== "customer") {
    //     const update = { role };
    //     const res = await UserRepository.upgradeRole(filter, update);
    //     if (!res) {
    //       throw throwCustomError("Failed to verify KYC", 420);
    //     }
    //   }
    // }
    if (!validate) {
      throw throwCustomError("Unable to verify KY", 422);
    }
    return "Your KYC has been Verified";
  }
}
