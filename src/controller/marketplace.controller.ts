import { IRequest } from "../midddleware/auth.middleware";
import { cartService } from "../services/cart.services";
import { Request, Response } from "express";

export class MarketplaceController {
  static createCart = async (req: IRequest, res: Response) => {
    try {
      const cart = await cartService.createCart(req.body);
      res.status(201).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  //convert this to toggle
  static removeItemFromCart = async (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.params;
      const cart = await cartService.removeItemFromCart(userId, productId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
