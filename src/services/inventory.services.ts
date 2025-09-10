import { InventController } from "../repository/inventory.repository";
import { IInventory } from "../interface/intentory.interface";
import { IProduct } from "../interface/product.interface";
import { throwCustomError } from "../midddleware/errorHandler.midleware";
export class InventoryService {
  static createInventory = async (data: IInventory) => {
    if (!data || !data.quantity || !data.location) {
      throw throwCustomError("All fields are required1", 400);
    }

    const response = await InventController.createInventory(data);

    if (!response) {
      throw throwCustomError("Inventory not created1", 500);
    }

    return "Inventory created successfully";
  };

  // product creation service

  static createProduct = async (data: IProduct) => {
    if (
      !data ||
      !data.productName ||
      !data.price ||
      !data.stock ||
      !data.currency ||
      !data.quantity
    ) {
      throw throwCustomError("All fields are required", 400);
    }

    //generate slug from product name

    data.slug = data.productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    if (!data.slug) {
      throw throwCustomError("Slug generation failed", 500);
    }

    const response = await InventController.createProduct(data);

    if (!response) {
      throw throwCustomError("Product not created", 500);
    }

    return "Product created successfully";
  };
  // update product service
  static updateProduct = async (id: string) => {
    const response = await InventController.updateProduct(id);
    if (!response) {
      throw throwCustomError("Product not found", 404);
    }
    return "Product updated successfully";
    };

    // delete product service
    static deleteProduct = async (id: string) => {
        const response = await InventController.findanddelete(id);
        if (!response) {
            throw throwCustomError("Product not found", 404);
        }
        return "Product deleted successfully";
    };

}
