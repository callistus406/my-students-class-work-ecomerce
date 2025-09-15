import { InventoryModel } from "../models/invent.model";
import { IProduct } from "../interface/product.interface";
import { productModel } from "../models/product.model";
import { Types } from "mongoose";

export class productRepository {
  static createInventory = async (data: {
    quantity: number;
    location: string;
  }) => {
    const response = await InventoryModel.create(data);
    if (!response) return null;
    return response;
  };

  static getinventory = async () => {
    const response = await InventoryModel.find();
    return response;
  };

  static findById = async (id: Types.ObjectId) => {
    const res = InventoryModel.findById(id).select("-__v");
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
  ) => {
    const skip = (page - 1) * limit;

    const response = await InventoryModel.find().lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await productModel.countDocuments();

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
  static updateProduct = async (id: string) => {
    const response = await productModel.findByIdAndUpdate(id, { new: true }).select("-__v");
    if (!response) return null;
    return response;
  };
  // find and delete product by id
  static findanddelete = async (id: string) => {
    const response = await productModel.findByIdAndDelete(id).select("-__v");
    if (!response) return null;
    return response;
  };

   static findProductByName = async (productName:string) =>{
    const response = await productModel.findOne({productName}).select("-__v");
    return response
   }

}
