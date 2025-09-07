import { ICreateMerchant } from "../interface/merchant-interface";
import { merchantModel } from "../models/merchant.model ";

export class MerchantRepository {
  static async createMerchant(merchant: ICreateMerchant) {
    const response = await merchantModel.create({
      userId: merchant._id,
    });

    return response;
  }
}
