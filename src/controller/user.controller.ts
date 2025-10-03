import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { IRequest } from "../midddleware/auth.middleware";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { Types } from "mongoose";

export class UserController {
  static getUser = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const objectId = new Types.ObjectId(userId);
    const response = await UserService.getUser(objectId);
    res.status(200).json({
      Success: true,
      payload: response,
    });
  });
  //   update password
  static changePassword = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { password, update } = req.body;
    const response = await UserService.updatePassword(userId, password, update);
    res.status(200).json({ success: true, payload: response });
  });
  // //   update profile
  static updateProfile = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { password, update } = req.body;
    const path = req.file?.originalname;
    if (!path) return null;
    const response = await UserService.updateProfile(
      userId,
      password,
      update,
      path
    );
    res.status(200).json({ success: true, payload: response });
  });

  //   upate profile picture
  static updatePicture = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const path = req.file?.originalname;
    if (!path) return "No file uploaded";
    const response = await UserService.profilePicture(userId, path);
    res.status(200).json({ success: true, payload: response });
  });
}
