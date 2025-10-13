import { Types } from "mongoose";

export interface IProduct {
  productName: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  isActive?: boolean;
  images: string[];
}

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    firstName?: string | null;
    email?: string | null;
    kycStatus?: string;
  };
}
