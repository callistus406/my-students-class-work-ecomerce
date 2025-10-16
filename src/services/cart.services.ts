import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { Types } from "mongoose";
import { productRepository } from "../repository/product.repository";
import { cartModel } from "../models/cart.model";

export class cartService {
  static updateCart = async (data: Cart, userId: Types.ObjectId) => {
    const { error } = cartValidate.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    if (Types.ObjectId.isValid(data.productId))
      throw throwCustomError("InvaliId", 422);
    //get product by id
    const product = await productRepository.findById(
      new Types.ObjectId(data.productId)
    );
    if (!product) throw throwCustomError("Product not found", 404);

    // Calculate total price
    const price = product.discountPrice ?? product.price;

    const cart = await cartModel.findOne({ ownerId: userId });
    if (!cart) {
      //create the cart

      await cartModel.create({
        ownerId: userId,
        items: [data],
        totalPrice: price * data.quantity,
      });
    } else {
      const exists = cart?.items.find(
        (item) => item.productId?.toString() === data.productId.toString()
      );
      if (exists) {
        const updated = await cartModel.findOneAndUpdate(cart._id, {
          $push: {
            items: {
              ...exists,
              quantity: data.quantity,
            },
          },
          $inc: {
            totalPrice: +price * data.quantity,
          },
        });
      }
      return {
        success: true,
        message: "Cart updated",
        data: cart,
      };
    }
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
