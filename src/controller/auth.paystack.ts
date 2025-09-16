import { Request, Response } from "express";
import { PaystackService } from "../services/paystack.service";

export class PaystackController {
  static async initiatePayment(req: Request, res: Response) {
    try {
      const { amount, email } = req.body;
      const response = await PaystackService.initiatePayment(amount, email);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
  static async verifyPayment(req: Request, res: Response) {
    try {
      const reference = req.params.reference;
      const response = await PaystackService.verifyPayment(reference);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  static async handleCallback(req: Request, res: Response) {
    try {
      const { reference } = req.body;
      if (!reference) {
        throw new Error("Transaction reference not provided");
      }
      const response = await PaystackService.verifyPayment(reference);
      if (response.data.status === "success") {
        res.status(200).json({ success: true, payload: response });
      } else {
        res.status(400).send({ message: "Payment verification failed" });
      }
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
}
