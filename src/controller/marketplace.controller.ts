import { Cart, CartItem } from "../interface/cart.interface";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";
import { cartService } from "../services/cart.services";
import { Request, Response } from "express";

export class MarketplaceController {
  static updateCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const data = req.body as Cart;
    const userId = req.user.id;
    const cart = await cartService.updateCart(data, userId);
    res.status(201).json(cart);
  });

  static createOrder = async (req: IRequest, res: Response) => {
    try {
      const { cartId, street, city, state } = req.body;
      const userId = req.user.id;
      const cart = await cartService.createOrder(cartId, userId, {
        street,
        city,
        state,
      });
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  static getCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const cart = await cartService.getcart(userId);
    res.status(200).json(cart);
  });
}
