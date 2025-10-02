import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { Types } from "mongoose";
import { productRepository } from "../repository/product.repository";

export class cartService {
  static createCart = async (data: Cart) => {
    const { error } = cartValidate.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);


    //get product by id
    const product = await productRepository.findById(data.productId as any);
    if (!product) throw throwCustomError("Product not found", 404);

    // Calculate total price

    const response = await cartRepository.cart({ ...data });

    const price = product.discountPrice ?? product.price;

    const totalAmount = response.items.reduce(
      (sum, item) => sum + price * item.quantity,
      0
    );
    return { ...response, totalAmount };
  };

  // this should be a toggle
  static removeItemFromCart = async (userId: string, productId: string) => {
    const response = await cartRepository.removeItemFromCart(
      new Types.ObjectId(userId),
      new Types.ObjectId(productId)
    );

    if (!response) {
      return { success: false, message: "Cart not found or item not in cart" };
    }

    return { success: true, message: "Item removed from cart", cart: response };
  };


}