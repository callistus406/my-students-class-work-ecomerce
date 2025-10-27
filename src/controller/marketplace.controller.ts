import { Cart, CartItem } from "../interface/cart.interface";
import { IRequest } from "../midddleware/auth.middleware";
import { cartService } from "../services/cart.services";
import { Request, Response } from "express";

export class MarketplaceController {
  static updateCart = async (req: IRequest, res: Response) => {
    const data = req.body as Cart;
    const userId = req.user.id;
    try {
      const cart = await cartService.updateCart(data, userId);
      res.status(201).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // //convert this to toggle
  // static removeItemFromCart = async (req: Request, res: Response) => {
  //   try {
  //     const { userId, productId } = req.params;
  //     const cart = await cartService.removeItemFromCart(userId, productId);
  //     res.status(200).json(cart);
  //   } catch (error: any) {
  //     res.status(400).json({ error: error.message });
  //   }
  // };

  static createOrder = async (req: IRequest, res: Response) => {
    try {
      const { cartId, street, city, state } = req.body;
      const userId = req.user.id;
      console.log(userId);

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
}
