import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { IRequest } from "../midddleware/auth.middleware";
import { asyncWrapper } from "../midddleware/asyncWrapper";

export class UserController {
  static getUser = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const response = await UserService.getUser(userId);
    res.status(200).json({
      message: "Success",
      data: response,
    });
  });

  //   update password

  //   update profile

  //   upate profile picture
}
