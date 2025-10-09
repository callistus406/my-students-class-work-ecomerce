import { Types } from "mongoose";

export interface IProduct {
  productName: string;
  slug?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  stock: number;
  quantity: number;
  sku?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
  avgRating?: number;
}

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    firstName?: string | null;
    email?: string | null;
    kycStatus?: string;
  };
}