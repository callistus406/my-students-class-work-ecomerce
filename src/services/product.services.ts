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
    const { error } = productValidate.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    if (data.price <= 0)
      throw throwCustomError("Price must be greater than 0", 400);
    if (data.stock < 0) throw throwCustomError("Stock cannot be negative", 400);
    if (data.quantity < 0)
      throw throwCustomError("Quantity cannot be negative", 400);

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
  static async getProducts(filter?: { page?: string; limit?: string; search?: string }) {
    let page = parseInt(filter?.page || "1", 10);
    let limit = parseInt(filter?.limit || "10", 10);
    const search = filter?.search || "";

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 100) limit = 100; // prevent abuse

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
}
