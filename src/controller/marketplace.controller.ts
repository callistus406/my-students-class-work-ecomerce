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

  // update order
  static updateOrder = asyncWrapper(async (req: Request, res: Response) => {
    try {
      const orderId = req.params.orderId;
      const {productId, quantity} = req.body;
      console.log("Order ID:", orderId);
      //console.log("Update Data:", updateData);

      const updatedOrder = await cartService.updateOrder(orderId as any, productId, quantity);
       if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      console.log("Updated Order:", updatedOrder);
      res.status(200).json({
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}
