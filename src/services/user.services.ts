import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/system.variable";
import crypto from "crypto";
import {userModel} from "../models/user.model";
import { OTPModel} from "../models/otp.model";
import {customer} from "../models/customer.model";
import {merchant} from "../models/merchant.model "; 
import { UserRepository } from "../repository/user.repository";
import { preValidate, userValidate } from "../validation/user.validate";
import { preRegister, IUsers } from "../interface/user.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { sendMail } from "../until/nodemailer";
import { otpTemplate } from "../until/otp-template";

export class UserService {
  static preRegister = async (user: preRegister) => {
    const { error } = preValidate.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    //create otp
    const otp = await UserService.generateOtp(user.email);
    if (!otp) {
      throw throwCustomError("OTP generation failed", 400);
    }
    console.log(otp);
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

    return "An email has been sent to your inbox";
  };

  static Register = async (user: IUsers) => {
    const { error } = userValidate.validate(user);

    if (error) {
      throw throwCustomError(error.message, 422);
    }

    if(!user.email.includes("@")){
      throw throwCustomError("Invalid email format", 400);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) {
      throw throwCustomError("Password hashing failed", 400);
    }
    //verify otp
    const isOtpValid = await UserRepository.otpVerify(user.email, user.otp as any);
    if (!isOtpValid) {
      throw throwCustomError("Invalid OTP", 400);
    }

    //check if user exists
    const isFound = await UserRepository.findUserByEmail(user.email);
    if (isFound) {
      throw throwCustomError("User already exists", 400);
    }

    const response = await UserRepository.register({
      ...user,
      password: hashedPassword,
      is_verified: true,
    });

    if(response){
      if(user.role === "customer"){
    const customerDoc = await customer.create({ userId: response._id });
        if(!customerDoc) throw throwCustomError("Customer creation failed", 400)
          return { success: true, user: response, customer: customerDoc };
    }else{
      const merchantDoc = await merchant.create({ userId: response._id });
      if(!merchantDoc) throw throwCustomError("Merchant creation failed", 400)
      return  { success: true, user: response, merchant: merchantDoc };
    }

    }

    if (!response) {
      throw new Error("User registration failed");
    }

    return response;
  };

  static async generateOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999);
    console.log("Generated OTP:", otp);
    // save otp

    await OTPModel.create({ email, otp });

    return otp;
  }

  static getUser = async () => {
    return await UserRepository.getUsers();
  };

  static login = async (email:string, password:string) => {
      if(!email || !password){
          throw new Error("Fields cannot be empty")
      }
      if (!email.includes("@")){
          throw new Error("Invalid Email")
      }

      const user = await UserRepository.findUserByEmail(email)

      if(!user){
          throw new Error("user does not exist")
      }

      const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword)
      throw throwCustomError("Invalid email or password", 400);
    
      const payload = {
          username: user.firstName,
          email:user.email,
      }
      let jwtKey =  jwt.sign(payload, JWT_SECRET, {expiresIn:"1m"})
      return {
          message:"Successfully Loggedin",
          authKey:jwtKey,
      }

  }
}
