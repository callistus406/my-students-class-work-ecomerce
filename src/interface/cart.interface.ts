import { Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  merchantId: Types.ObjectId;
  productName: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  currency: string;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
