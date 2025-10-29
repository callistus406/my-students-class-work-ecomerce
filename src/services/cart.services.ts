import { cartRepository } from "../repository/cart.repository";
import { Cart } from "../interface/cart.interface";
import { cartValidate } from "../validation/cart.validate";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { Types } from "mongoose";
import { productRepository } from "../repository/product.repository";
import { cartModel } from "../models/cart.model";
import { userModel } from "../models/user.model";
import { PaystackService } from "./paystack.service";
import { orderModel } from "../models/order.model";

export class cartService {
  //
  static updateCart = async (data: Cart, userId: Types.ObjectId) => {
    const { error } = cartValidate.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    if (!Types.ObjectId.isValid(data.productId))
      throw throwCustomError("InvaliId Product ID", 422);
    //get product by id
    const product = await productRepository.findById(
      new Types.ObjectId(data.productId)
    );
    if (!product) throw throwCustomError("Product not found", 404);

    // Calculate total price
    const price = product.discountPrice ?? product.price;

    // check if product is in stock
    const stock =  await productRepository.findById(data.quantity as any);
    if(!stock) throw throwCustomError("Product out of stock", 400);
    //get user cart
    const cart = await cartModel.findOne({ ownerId: userId });
    if (!cart) {
      //create the cart
      const res = await cartModel.create({
        ownerId: userId,
        items: [
          {
            productId: data.productId,
            quantity: data.quantity,
            price: price,
          },
        ],
        totalPrice: price * data.quantity,
      });
      return {
        success: true,
        message: "Cart updated",
        data: res,
      };
    } else {
      const idx = cart?.items.findIndex(
        (item) => item.productId?.toString() === data.productId.toString()
      );

      if (idx > -1) {
        cart.items[idx].quantity = data.quantity;
      } else {
        cart.items.push({
          productId: data.productId,
          quantity: data.quantity,
          price: price,
        });
      }

      const sum = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart.totalPrice = sum;

      await cart.save();

      return {
        success: true,
        message: "Cart updated",
        data: cart,
      };
    }
  };

  //order

  static createOrder = async (
    cartId: Types.ObjectId,
    userId: Types.ObjectId,
    shippingAddress: {
      street: string;
      city: string;
      state: string;
    }
  ) => {
    console.log("oooooooooooo");

    try {
      const user = await userModel.findById(userId);
      if (!user) throw throwCustomError("User not found", 404);
      console.log({
        userId,
        cartId,
      });
      const cart = await cartModel.findById(cartId);
      if (!cart) throw throwCustomError("Cart not found", 404);

      const order = await orderModel.create({
        userId,
        cartId,
        subTotal: cart.totalPrice,
        paymentMethod: "paystack",
        status: "draft",
        currency: "NGN",
        totalPrice: cart.totalPrice,
      });

      console.log(order);

      //clear cart

      cart.items = [];
      cart.totalPrice = 0;

      await cart.save();

      // initiate payment

      if (!order) throw throwCustomError("Unable to create order", 500);
      const payment = await PaystackService.initiatePayment(
        order.totalPrice as number,
        user.email as string,
        order._id.toString()
      );

      return {
        order: order,
        payment,
      };
    } catch (error) {
      console.log(error);
    }
  };
}
