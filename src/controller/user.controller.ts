import { Request, Response } from "express";
import { IUsers } from "../interface/user.interface";
import { UserService } from "../services/user.services";
import { AnyARecord } from "dns";

export class UserController {
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
      const user = req.body as IUsers;
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

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response = await UserService.login(email, password);
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
}
