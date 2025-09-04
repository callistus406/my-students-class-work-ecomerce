import { Request, Response } from "express";
import { IVerifyUser } from "../interface/user.interface";
import { UserService } from "../services/user.services";
import { AnyARecord } from "dns";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";

export class AuthController {
  static preRegister = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      const response = await UserService.preRegister(user);
      console.log(response);
      res.status(201).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static registration = async (req: Request, res: Response) => {
    try {
      const user = req.body as IVerifyUser;
      const response = await UserService.Register(user);
      console.log(response);
      res.status(201).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const response = await UserService.getUser();
      res.status(200).json({
        message: "Success",
        data: response,
      });
    } catch (error: any) {
      res.status(400).json({
        message: "Bad Request",
        data: error.message,
      });
    }
  };

  static login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ipAddress = req.ip as string;
    const userAgent = req.headers["user-agent"] as string;
    const response = await UserService.login(
      email,
      password,
      ipAddress,
      userAgent
    );
    res.status(200).json({
      success: true,
      payload: response,
    });
  });

  // ==================|| KYC VERIFICATION ||==============================================
  static verifyKyc = asyncWrapper(async (req: IRequest, res: Response) => {
    const { firstName, lastName, dateOfBirth, bvn, nin } = req.body;

    const userId = req.user.id;

    const response = await UserService.verifyKyc({
      firstName,
      lastName,
      dateOfBirth,
      bvn,
      nin,
      userId,
    });
    res.status(200).json({ success: true, payload: response });
  });
}
