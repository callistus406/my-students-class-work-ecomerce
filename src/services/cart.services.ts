import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";

export class cartService {
  static createCart = async (data: Cart) => {
    const { error } = cartValidate.validate(data);
    if (error) throw new Error(`Validation error: ${error.message}`);

    const totalPrice = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const response = await cartRepository.cart({ ...data, totalPrice });
    return response;
  };
}
