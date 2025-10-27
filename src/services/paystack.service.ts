import axios from "axios";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { PaymentRepository } from "../repository/paystack.repo";
import { Paystack } from "../utils/paystack";

export class PaystackService {
  static async initiatePayment(amount: number, email: string, orderId: string) {
    try {
      const paymentData = {
        amount,
        email,
      };
      const paystackResponse = await Paystack.initializeTransaction({
        amount: paymentData.amount * 100, // to kobo
        email: paymentData.email,
        callback_url: "http://localhost:3000/api/v1/paystack/callback",
        metadata: {
          orderId,
        },
      });
      return paystackResponse;
    } catch (error: any) {
      if (error.response) {
        throw throwCustomError(error.response?.data.message, 400);
      }
    }
  }

  static async verifyPayment(reference: any) {
    try {
      console.log("this is the ref", reference);
      const response = await Paystack.verifyPayment(reference);
      console.log(response);
      return response;
    } catch (error: any) {
      if (error.response) {
        throw throwCustomError(error.response?.data.message, 400);
      }
    }
  }
}
