import { Request, Response } from "express";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { CustomerServices } from "../services/customer.services";
import { IRequest } from "../midddleware/auth.middleware";

export class AuthCstController {
  static getAllCustomers = asyncWrapper(async (req: Request, res: Response) => {
    const response = await CustomerServices.getCustomers();
    res.status(200).json({ success: true, payload: response });
  });

  static getCustomerById = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const response = await CustomerServices.getCustomer(userId);
      res.status(200).json({ success: true, payload: response });
    }
  );
}
