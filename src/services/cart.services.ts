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

    if (data.quantity > product.quantity)
      throw throwCustomError("Out of stock", 400);

    //get user cart
    const cart = await cartModel.findOne({ ownerId: userId });
    if (!cart) {
      //create the cart
      const res = await cartModel.create({
        ownerId: userId,
        items: [
          {
            productId: data.productId,
            productName: product.productName,
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

  static async getcart(userId: Types.ObjectId) {
    const cart = await cartModel.findOne({
      ownerId: userId,
    });

    if (!cart) throw throwCustomError("Cart not found", 404);

    return {
      success: true,
      message: "Cart retrived successfully",
      data: cart,
    };
  }

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
    try {
      const user = await userModel.findById(userId);
      if (!user) throw throwCustomError("User not found", 404);
      const cart = await cartModel.findById(cartId);
      if (!cart) throw throwCustomError("Cart not found", 404);
      const orderId = `ORD-${Date.now()}`;
      const order = await orderModel.create({
        userId,
        cartId,
        orderId,
        subTotal: cart.totalPrice,
        paymentMethod: "paystack",
        status: "draft",
        currency: "NGN",
        totalPrice: cart.totalPrice,
      });

      if (!order) throw throwCustomError("Unable to create order", 500);
      // initiate payment

      const payment = await PaystackService.initiatePayment(
        order.totalPrice as number,
        user.email as string,
        order._id.toString()
      );

      return {
        success: true,
        message: "Payment link",
        order: order,
        payment,
      };
    } catch (error: any) {
      throw error;
    }
  };

  // update order
  static async updateOrder(cartId: Types.ObjectId, updateData: any) {
     if (!cartId) {
      throw new Error("Cart ID is required");
    }
     if (!updateData || typeof updateData !== "object") {
      throw new Error("Update data must be an object");
    }

    const cart = await cartRepository.updateOrder(
      cartId,
      updateData
    );
    await cart?.save();
    return cart;
  }


  


}
