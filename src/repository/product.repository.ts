import { IProduct } from "../interface/product.interface";
import { IReview } from "../interface/review.interface";
import { productModel } from "../models/product.model";
import { Types } from "mongoose";
import { reviewModel } from "../models/review.model";
import { Cart, CartItem } from "../interface/cart.interface";
import { cartModel } from "../models/cart.model";

export class productRepository {
  static findById = async (id: Types.ObjectId) => {
    const res = productModel.findById(id).lean();
    if (!res) return null;
    return res;
  };

  // product creations
  static createProduct = async (data: IProduct) => {
    const response = await productModel.create(data);
    if (!response) return null;
    return response;
  };

  // get product
  static getProducts = async (
    page: number,
    limit: number,
    search: string = ""
  ) => {
    const skip = (page - 1) * limit;

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = search
      ? { productName: { $regex: escapeRegex(search), $options: "i" } }
      : {};

    const response = await productModel
      .find(query)
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await productModel.countDocuments(query);

    const total = Math.ceil(count / limit);

    return {
      products: response,
      meta: {
        pages: total,
        page: page,
        limit: limit,
        totalRecords: count,
      },
    };
  };

  // update product by id
  static updateProduct = async (id: Types.ObjectId) => {
    const response = await productModel
      .findByIdAndUpdate(id, {}, { new: true })
      .lean();

    if (!response) return null;
    return response;
  };
  // find and delete product by id
  static findAndDelete = async (id: string): Promise<any> => {
    const response = await productModel.findByIdAndDelete(id).lean();
    if (!response) return null;
    return response;
  };

  static findProductByName = async (productName: string) => {
    const response = await productModel.findOne({ productName }).lean();
    return response;
  };
  static findProductBySlug = async (slug: string) => {
    const response = await productModel.findOne({ slug }).lean();
    return response;
  };
  //Product rating
  static async rating(review: IReview): Promise<any> {
    const response = await reviewModel.create({
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
    });
    if (!response) return null;
    return response;
  }
}
