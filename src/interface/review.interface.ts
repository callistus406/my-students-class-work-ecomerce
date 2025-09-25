import { Types } from "mongoose";

export interface IReview {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: string;
  comment: String;
}
