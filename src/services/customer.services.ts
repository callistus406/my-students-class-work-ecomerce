import { Paystack } from "../utils/paystack";

import mongoose, { Types } from "mongoose";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { CustomerRepository } from "../repository/customer-repository";

export class CustomerServices {
  static getCustomers = async () => {
    const res = await CustomerRepository.getCustomers();
    if (!res) {
      throw throwCustomError("Unable to perform operation", 403);
    }
    return res;
  };

  static getCustomer = async (userId: Types.ObjectId) => {
    const res = await CustomerRepository.getCustomerById(userId);
    if (!res) {
      throw throwCustomError("unable to perform task", 405);
    }
    return res;
  };
}
