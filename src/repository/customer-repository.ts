import { Types } from "mongoose";
import { ICreateCustomer } from "../interface/customer-interface";
import { customerModel } from "../models/customer.model";
import { payoutModel } from "../models/paystack.model";
import { reviewModel } from "../models/review.model";
import { IReview } from "../interface/review.interface";
import { userInfo } from "os";

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

  static async getCustomerById(userId: Types.ObjectId) {
    const res = await customerModel.findById({ _id: userId }).populate({
      path: "userId",
      model: "User",
    });
    if (!res) return null;
    return {
      userId: res._id,
      email: (res.userId as any).email,
      name: `${(res.userId as any).firstName} ${(res.userId as any).lastName}`,
    };
  }
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
