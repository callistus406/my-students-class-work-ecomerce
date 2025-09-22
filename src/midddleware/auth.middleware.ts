import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { userModel } from "../models/user.model";
import { JWT_SECRET } from "../config/system.variable";

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    firstName?: string | null;
    email?: string | null;
    is_verified?: boolean;
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
      firstName: user?.firstName,
      email: user?.email,
      id: user._id,
      is_verified: user.is_verified,
    };
    next();
  });
};
