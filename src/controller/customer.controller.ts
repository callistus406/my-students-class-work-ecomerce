import { Request, Response } from "express";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { CustomerServices } from "../services/customer.services";
import { IRequest } from "../midddleware/auth.middleware";
import mongoose from "mongoose";

export class CustomerController {
  static getAllCustomers = asyncWrapper(async (req: Request, res: Response) => {
    const response = await CustomerServices.getCustomers();
    res.status(200).json({ success: true, payload: response });
  });

  static getCustomerById = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.params.id;
      const objectId = new mongoose.Types.ObjectId(userId);
      const response = await CustomerServices.getCustomer(objectId);
      res.status(200).json({ success: true, payload: response });
    }
  );
}
