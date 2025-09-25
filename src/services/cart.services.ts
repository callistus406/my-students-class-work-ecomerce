import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { Types } from "mongoose";

export class cartService {
  static createCart = async (data: Cart) => {
    const { error } = cartValidate.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    // Calculate total price


    const totalPrice = cartService.calculateTotalPrice(data.items);

    const response = await cartRepository.cart({ ...data, totalPrice });
    return response;
  };

  static calculateTotalPrice = (items:  { unitPrice: number; quantity: number }[]) => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

static removeItemFromCart = async (
  userId: string,
  productId: string
) => {
  const response = await cartRepository.removeItemFromCart(
    new Types.ObjectId(userId),
    new Types.ObjectId(productId)
  );

  if (!response) {
    return { success: false, message: "Cart not found or item not in cart" };
  }

  return { success: true, message: "Item removed from cart", cart: response };
};


  static updateCart = async ( data: Cart) => {
  if (!data) throwCustomError("No data provided for update", 400);
    const response = await cartRepository.updateCart(
      data
    );
    return response;
  };
}
