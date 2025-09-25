import { productService } from "../services/product.services";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";

export class InventoryController {
  // product creation controller
  static createProduct = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      const response = await productService.createProduct(data);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  static findById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const objectId = new mongoose.Types.ObjectId(id);
      const item = await productService.findById(objectId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Inventory item not found",
        });
      }

      res.status(200).json({
        success: true,
        payload: item,
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // get product
  static getproduct = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as {
        page: string;
        limit: string;
      };

      const response = await productService.getProducts({ page, limit });

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  };

  // update product controller
  static updateProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const response = await productService.updateProduct(id);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  // delete product controller
  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const response = await productService.deleteProduct(id);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };
  //Product Rating
  static rating = asyncWrapper(async (req: IRequest, res: Response) => {
    const productId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(productId);
    const userId = req.user.id;
    const { rating, comment } = req.body;
    const response = await productService.rating(
      objectId,
      userId,
      rating,
      comment
    );
    res.status(200).json({ success: true, payload: response });
  });
}
