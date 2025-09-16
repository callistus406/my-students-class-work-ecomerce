import { Types } from "mongoose";
import { ICreateCustomer } from "../interface/customer-interface";
import { customerModel } from "../models/customer.model";
import { payoutModel } from "../models/paystack.model";

export class CustomerRepository {
  static async createCustomer(customer: ICreateCustomer) {
    const response = await customerModel.create({
      userId: customer._id,
    });

    return response;
  }

  static async getCustomers() {
    const response = await customerModel.find().populate({
      path: "userId",
      model: "User",
    });
    if (!response) return null;
    return response;
  }

  static async getCustomerById(userid: Types.ObjectId) {
    const res = await customerModel
      .findById({ _id: userid })
      .select("-password, __v,")
      .populate({
        path: "userId",
        model: "User",
      });
    if (!res) return null;
    return res;
  }
  static async initializeTrans(
    userId: Types.ObjectId,
    data: any
  ): Promise<any> {
    const response = await payoutModel.findByIdAndUpdate({ userId, data });
    if (!response) return null;
    return response;
  }
}
