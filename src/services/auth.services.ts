import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/system.variable";
import crypto from "crypto";
import { otpModel } from "../models/otp.model";
import { customer } from "../models/customer.model";
import { merchant } from "../models/merchant.model ";
import { UserRepository } from "../repository/user.repository";
import { preValidate, userValidate } from "../validation/user.validate";
import { IPreRegister, IVerifyUser } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { sendMail } from "../util/nodemailer";
import { otpTemplate } from "../util/otp-template";

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
    if (isFound && !user.is_Varified)
      throw throwCustomError("Please verify your account", 400);
    // generate password
    const hashedPassword = await bcrypt.hash(user.password, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    // if user  does not exist  create user
    const response = await UserRepository.createUser({
      ...user,
      password: hashedPassword,
      is_Varified: false,
    });
    if (!response) throw throwCustomError("Unable to create account", 500);

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

    const savedOtp = await UserRepository.saveOtp(email, otp.toString());
    if (!savedOtp) {
      throw throwCustomError("Unable to generate OTP", 500);
    }

    return otp;
  }

    // request otp
  static requestOtp = async (email:string) =>{
    if(!email) throw throwCustomError("Email is required",400);
    const user = await UserRepository.findUserByEmail(email);
    if(!user) throw throwCustomError("User not found",404);

    const otp = await UserService.generateOtp(email);
    console.log("do not share with anyone",otp);
    if(!otp) throw throwCustomError("Unable to generate OTP",500);
    // send otp via mail
    sendMail(
      {
        email: email,
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate
    );

    return "OTP sent to your email";

  }

  //request reset password {email to send to recieve otp}

  static requestPasswordReset = async (email: string) => {
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
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate
    );

    return "OTP sent to your email";

  }

//reset password

  static resetPassword = async (email: string, otp: string, newPassword: string) => {
    if (!email || !otp || !newPassword) {
      throw throwCustomError("All fields are required", 400);
    }

    const isOtpValid = await UserRepository.otpVerify(email, otp);
    if (!isOtpValid) {
      throw throwCustomError("Invalid OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) {
      throw throwCustomError("Password hashing failed", 500);
    }
    const response = await UserRepository.resetPassword(email, otp, hashedPassword);
    if (!response) {
      throw throwCustomError("Unable to reset password", 500);
    }

    return "Password reset successfully";
  };

  static getUser = async () => {
    return await UserRepository.getUsers();
  };

  static login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Fields cannot be empty");
    }

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("user does not exist");
    }

    const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword)
      throw throwCustomError("Invalid email or password", 400);

    const payload = {
      username: user.firstName,
      email: user.email,
    };
    let jwtKey = jwt.sign(payload, JWT_SECRET, { expiresIn: "1m" });
    return {
      message: "Successfully Loggedin",
      authKey: jwtKey,
    };
  };

  // request otp   done
  //request reset password {email to send to recieve otp}
  //reset password
  //{email, otp, new password}
  // verify otp {not compulsory}
  // hash the otp 1 round
}
