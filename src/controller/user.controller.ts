import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { IRequest } from "../midddleware/auth.middleware";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import mongoose, { Types } from "mongoose";

export class UserController {
  static getUser = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const objectId = new mongoose.Types.ObjectId(userId);
    const response = await UserService.getUser(objectId);
    res.status(200).json({
      Success: true,
      payload: response,
    });
  });
  //   update password
  static updatePassword = asyncWrapper(async (req: IRequest, res: Response) => {
    const id = req.user.id;
    const update = req.body;
    const response = await UserService.updatePassword(id, update);
    res.status(200).json({ success: true, payload: response });
  });
  // //   update profile
  static updateProfile = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const updateData = req.body;
    const response = await UserService.updateProfile(userId, updateData);
    res.status(200).json({ success: true, payload: response });
  });

  //   upate profile picture
}
