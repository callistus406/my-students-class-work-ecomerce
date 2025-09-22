import { productRepository } from "../repository/product.repository";
import { Types } from "mongoose";
import { IInventory } from "../interface/intentory.interface";
import { IProduct } from "../interface/product.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { productValidate } from "../validation/product.validate";
import { reviewModel } from "../models/review.model";
export class productService {
  static createInventory = async (data: IInventory) => {
    if (!data || !data.quantity || !data.location) {
      throw throwCustomError("All fields are required1", 400);
    }

    const response = await productRepository.createInventory(data);

    if (!response) {
      throw throwCustomError("Inventory not created1", 500);
    }

    return "Inventory created successfully";
  };

  static getinventory = async () => {
    const response = await productRepository.getinventory();
    return response;
  };

  static findById = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("id is required", 400);
    }
    const response = await productRepository.findById(id);
    return response;
  };

  // product creation service

  static createProduct = async (data: IProduct) => {
    const { error } = productValidate.validate(data);
    if (error) {
      //console.log(error.details[0].message);
      throw throwCustomError(error.details[0].message, 400);
    }
    if (!data || !data.productName) {
      throw throwCustomError("Product name is required", 400);
    }

    //generate slug from product name

    const slugs = data.productName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-{2,}/g, "-");

    console.log(slugs);

    data.slug = slugs;

    const response = await productRepository.createProduct(data);

    if (!response) {
      throw throwCustomError("Product not created", 500);
    }

    return "Product created successfully";
  };

  // get product
  static getProducts = async (filter: {
    page: string;
    limit: string;
    // search: string;
  }) => {
    const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 10;

    const response = await productRepository.getProducts(page, limit);

    return response;
  };

  // update product service
  static updateProduct = async (id: string) => {
    const response = await productRepository.updateProduct(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product updated successfully";
  };

  // delete product service
  static deleteProduct = async (id: string) => {
    const response = await productRepository.findanddelete(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product deleted successfully";
  };

  static findProductByName = async (productName: string) => {
    if (!productName) {
      throw throwCustomError("Provide Product Name", 400);
    }
    const response = await productRepository.findProductByName(productName);
    if (!response) {
      throw throwCustomError("product not find", 500);
    }
    return response;
  };

  static rateProduct = async (
    productId: Types.ObjectId,
    rating: number,
    review: string
  ) => {
    const product = await productRepository.findProductById(productId);
    if (!product) {
      throw throwCustomError("No product ID found", 400);
    }
    product.avgRating =
      (product.avgRating * product.ratingCount + rating) /
      (product.ratingCount + 1);
    product.ratingCount++;

    await productRepository.save(product);

    const ratingDoc = new reviewModel({ productId, rating, review });
    const response = await productRepository.createRating(ratingDoc);
    if (!response) {
      throw throwCustomError("Unavle to leave a review", 400);
    }
    return response;
  };
}
