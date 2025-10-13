import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { USER_TYPE, userModel } from "../models/user.model";
import { JWT_SECRET } from "../config/system.variable";

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    email: string;
    is_verified?: boolean;
    userType: string;
  };
}

export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split("Bearer ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, async (err, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    const user = await userModel.findById(new Types.ObjectId(data.userId));
    console.log(data);

    if (!user) return res.sendStatus(401);
    req.user = {
      email: user.email as string,
      id: user._id,
      is_verified: user.is_verified,
      userType: data.userType,
    };
    next();
  });
};

export const customerMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
): any => {
  const user = req.user;
  if (!user) return res.sendStatus(403);

  if (user.userType !== USER_TYPE.CUSTOMER)
    return res
      .status(403)
      .json({ payload: "You are not authorized to access this resource" });

  next();
};

export const merchantMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
): any => {
  const user = req.user;
  if (!user) return res.sendStatus(403);

  if (user.userType !== USER_TYPE.MERCHANT)
    return res
      .status(403)
      .json({
        status: false,
        payload: "You are not authorized to access this resource",
      });

  next();
};
