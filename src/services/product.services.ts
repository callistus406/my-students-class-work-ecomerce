import { productRepository } from "../repository/product.repository";
import { Types } from "mongoose";
import { IInventory } from "../interface/intentory.interface";
import { IProduct } from "../interface/product.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import {
  productValidate,
  ratingValidate,
} from "../validation/product.validate";
import { reviewModel } from "../models/review.model";
export class productService {

  static findById = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("id is required", 422);
    }
    // const response = await productRepository.findById(id);
    return "response";
  };
  // product creation service

  static createProduct = async (data: IProduct, files: any) => {
    const { error } = productValidate.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    if (files?.length === 0) throw throwCustomError("images are required", 422);
    let images = files.map((item: any) => `http://localhost:3000/${item.path}`);

    if (data.price <= 0)
      throw throwCustomError("Price must be greater than 0", 400);

    const slug = data.productName.toLowerCase().trim().replace(/\s+/g, "-");

    //check if the product exist

    const isFound = await productRepository.findProductBySlug(slug);
    if (isFound) throw throwCustomError("Product exists", 409);

    const response = await productRepository.createProduct({
      ...data,
      slug,
      images,
    });

    if (!response) {
      throw throwCustomError("Product not created", 500);
    }

    return "Product created successfully";
  };

  // get product
  static getProducts = async (filter?: {
    page?: string;
    limit?: string;
    search?: string;
  }) => {
    let page = parseInt(filter?.page || "1", 10);
    let limit = parseInt(filter?.limit || "10", 10);
    const search = filter?.search || "";

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 100) limit = 100; 

    return productRepository.getProducts(page, limit, search);
  }

  // update product service
  static updateProduct = async (id: string) => {
    const response = await productRepository.updateProduct(
      new Types.ObjectId(id)
    );
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product updated successfully";
  };

  // delete product service
  static deleteProduct = async (id: string) => {
    const response = await productRepository.findAndDelete(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product deleted successfully";
  };
  //Product Rating
  static rating = async (
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    rating: string,
    comment: string
  ): Promise<any> => {
    //TODO: validation
    const { error } = ratingValidate.validate({ rating, comment });
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    const response = await productRepository.rating({
      productId,
      userId,
      rating,
      comment,
    });
    if (!response) {
      throw throwCustomError("unable to review this product", 400);
    }
    return {
      productId: response.productId,
      productName: response.productId.productName,
      firstName: response.userId.firstName,
      rating: rating,
      comment: comment,
    };
  };

  //fetch
  //edit
  //delete
}

// product => rating
