import { cartService } from "../services/cart.services";
import { Request, Response } from "express";

export class cartController {
  static createCart = async (req: Request, res: Response) => {
    try {
      const cart = await cartService.createCart(req.body);
      res.status(201).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
