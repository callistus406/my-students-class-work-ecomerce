import{Schema} from "mongoose";

export interface IProduct {
  merchantId: Schema.Types.ObjectId;
  productName: string;
  slug: string;
  description?: string;
  categoryId?: Schema.Types.ObjectId;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  sku: string;
  images: string[];
  tags?: string[];
  isActive?: boolean;
  avgRating?: number;
  ratingCount?: number;
  quantity: number;
}
