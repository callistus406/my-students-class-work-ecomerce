import { Types } from "mongoose";
import { ICreateMerchant } from "../interface/merchant-interface";
import { merchantModel } from "../models/merchant.model ";

export class MerchantRepository {
  static async createMerchant(merchant: ICreateMerchant) {
    const response = await merchantModel.create({
      userId: merchant._id,
    });

    return response;
  }
  static findMerchant = async (userId: Types.ObjectId): Promise<any> => {
    const response = await merchantModel.findOne({ userId }).populate({
      path: "userId",
      model: "User",
    });
    if (!response) return null;
    return response;
  };
  static update = async (id: Types.ObjectId, update: any) => {
    const response = await merchantModel.findOneAndUpdate(id, update, {
      new: true,
    });
    if (!response) return null;
    return response;
  };
}
