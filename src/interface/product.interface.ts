import { Types } from "mongoose";

export interface IProduct {
  merchantId: Types.ObjectId | string;
  productName: string;
  slug?: string;
  description?: string;
  //categoryId?: Types.ObjectId | string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  quantity: number;
  ratingCount?: number;
  sku?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
  avgRating?: number;
}
