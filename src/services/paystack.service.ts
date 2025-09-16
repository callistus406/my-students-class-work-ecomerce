import axios from "axios";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { PaymentRepository } from "../repository/paystack.repo";
import { Paystack } from "../utils/paystack";

export class PaystackService {
  static async initiatePayment(amount: number, email: string) {
    try {
      const paymentData = {
        amount,
        email,
      };

      //   const payment = await PaymentRepository.CreatePayment(paymentData);
      const paystackResponse = await Paystack.initializeTransaction({
        amount: paymentData.amount * 100,
        email: paymentData.email,
        callback_url: "http://localhost:8080/api/v1/paystack/callback",
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
