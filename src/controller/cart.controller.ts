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

    static removeItemFromCart = async (req: Request, res: Response) => {
        try {
            const { userId, productId } = req.params;
            const cart = await cartService.removeItemFromCart(userId, productId);
            res.status(200).json(cart);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

  static updateCart = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const newItem = req.body;
      await cartService.updateCart(userId, newItem);
      res.status(200).json({ message: "Cart updated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
