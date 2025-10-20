import { cartModel } from "../models/cart.model";
import { Cart, CartItem } from "../interface/cart.interface";
import { Types } from "mongoose";

export class cartRepository {
  static cart = async (data: Cart) => {
    const response = await cartModel.create(data);
    return response;
  };

  static async getCartId(userId: Types.ObjectId) {
    const cart = await cartModel.findOne({ userId });
    return cart;
  }

  static async addItemToCart(userId: Types.ObjectId, newItem: CartItem) {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      const totalPrice = newItem.unitPrice * newItem.quantity;

      return await cartModel.create({
        userId,
        items: [newItem],
        currency: "NIG",
        totalPrice,
      });
    }

    // Find existing item safely
    const existingItem = cart.items.find(
      (item) =>
        item.productId &&
        item.productId.toString() === newItem.productId.toString()
    );

    if (existingItem) {
      existingItem.quantity =
        (existingItem.quantity ?? 0) + (newItem.quantity ?? 0);
    } else {
      cart.items.push(newItem);
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const unit = item.unitPrice ?? 0;
      const qty = item.quantity ?? 0;
      return sum + unit * qty;
    }, 0);

    await cart.save();
    return cart;
  }

  static async removeItemFromCart(
    userId: Types.ObjectId,
    productId: Types.ObjectId
  ) {
    const cart = await cartModel.findOneAndUpdate(
      { userId: userId }, 
      { $pull: { products: { productId: productId } } },
    );
    return cart;
  }

  static updateCart = async ( data:Cart) => {
    const cart = await cartModel.findOneAndUpdate(data, {
      new: true,
    });
    return cart;
  }
 

}