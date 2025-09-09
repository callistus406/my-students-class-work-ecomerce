import { ICreateCustomer } from "../interface/customer-interface";
import { customerModel } from "../models/customer.model";

export class CustomerRepository {
  static async createCustomer(customer: ICreateCustomer) {
    const response = await customerModel.create({
      userId: customer._id,
    });

    return response;
  }
}
