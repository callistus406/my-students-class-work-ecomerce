import { inventRepository } from "../repository/inventory.repository";
import { Types } from "mongoose";
import { IInventory } from "../interface/intentory.interface";
import { IProduct } from "../interface/product.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
import { productValidate } from "../validation/product.validate";
export class InventoryService {
  static createInventory = async (data: IInventory) => {
    if (!data || !data.quantity || !data.location) {
      throw throwCustomError("All fields are required1", 400);
    }

    const response = await inventRepository.createInventory(data);

    if (!response) {
      throw throwCustomError("Inventory not created1", 500);
    }

    return "Inventory created successfully";
  };

  static getinventory = async () => {
    const response = await inventRepository.getinventory();
    return response;
  };

  static findById = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("id is required", 400);
    }
    const response = await inventRepository.findById(id);
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

    const response = await inventRepository.createProduct(data);

    if (!response) {
      throw throwCustomError("Product not created", 500);
    }

    return "Product created successfully";
  };
  // update product service
  static updateProduct = async (id: string) => {
    const response = await inventRepository.updateProduct(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product updated successfully";
  };

  // delete product service
  static deleteProduct = async (id: string) => {
    const response = await inventRepository.findanddelete(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product deleted successfully";
  };
}
