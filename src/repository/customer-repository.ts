import { Types } from "mongoose";
import { ICreateCustomer } from "../interface/customer-interface";
import { customerModel } from "../models/customer.model";

export class CustomerRepository {
  static async createCustomer(customer: ICreateCustomer) {
    const response = await customerModel.create({
      userId: customer._id,
    });

    return response;
  }
  static findCustomer = async (userId: Types.ObjectId): Promise<any> => {
    const response = await customerModel.findOne({ userId }).populate({
      path: "userId",
      model: "User",
    });
    if (!response) return null;
    return response;
  };

  static getCustomers = async (userid: Types.ObjectId) => {
    const response = await customerModel
      .find()
      .populate({ path: "userid", model: "User" });
  };
  static update = async (id: Types.ObjectId, updated: any) => {
    const response = await customerModel.findOneAndUpdate(
      { _id: id },
      updated,
      {
        new: true,
      }
    );
    if (!response) return null;
    return response;
  };
}
