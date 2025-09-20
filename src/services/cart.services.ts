import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { Types } from "mongoose";

export class cartService {
  static createCart = async (data: Cart) => {
    const { error } = cartValidate.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    const totalPrice = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const response = await cartRepository.cart({ ...data, totalPrice });
    return response;
  };

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


  static updateCart = async (userId: string, newItem: any) => {
    if (!Types.ObjectId.isValid(userId)) {
      throwCustomError("Invalid userId", 400);
    }
    const response = await cartRepository.updateCart(
      userId as any,
      newItem
    );
    return response;
  };
}
