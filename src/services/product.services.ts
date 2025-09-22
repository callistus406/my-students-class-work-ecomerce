import { productRepository } from "../repository/product.repository";
import { Types } from "mongoose";
import { IInventory } from "../interface/intentory.interface";
import { IProduct } from "../interface/product.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { productValidate } from "../validation/product.validate";
export class productService {
  static findById = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("id is required", 422);
    }
    const response = await productRepository.findById(id);
    return response;
  };

  // product creation service

  static createProduct = async (data: IProduct) => {
    //Note this is not the complete logic
    const { error } = productValidate.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    //generate slug from product name

    const slug = data.productName.toLowerCase().trim().replace(/\s+/g, "-");
    data.slug = slug;

    //check if the product exist

    const isFound = await productRepository.findProductBySlug(slug);
    if (isFound) throw throwCustomError("Product exists", 409);

    const response = await productRepository.createProduct(data);

    if (!response) {
      throw throwCustomError("Product not created", 500);
    }

    return "Product created successfully";
  };

  // get product
  static getProducts = async (filter: { page: string; limit: string }) => {
    const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 10;

    const response = await productRepository.getProducts(page, limit);

    return response;
  };

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
}
