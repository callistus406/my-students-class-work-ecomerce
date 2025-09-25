import { productService } from "../services/product.services";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";

export class InventoryController {
  // product creation controller
  static createProduct = asyncWrapper(async (req: Request, res: Response) => {
    const data = req.body.data;
    const response = await productService.createProduct(data);
    res.status(200).json({ success: true, payload: response });
  });

  static findById = asyncWrapper(async (req: Request, res: Response) => {
    async (req: Request, res: Response) => {
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
    };
  });

  // get product
  static getProducts = asyncWrapper(async (req: Request, res: Response) => {
    const filter = {
      page: req.query.page?.toString(),
      limit: req.query.limit?.toString(),
      search: req.query.search?.toString(),
    };

    const response = await productService.getProducts(filter);

    return res.status(200).json({
      success: true,
      ...response,
    });
  });

  // update product controller
  static updateProduct = asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await productService.updateProduct(id);
    res.status(200).json({ success: true, payload: response });
  });

  // delete product controller
  static deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await productService.deleteProduct(id);
    res.status(200).json({ success: true, payload: response });
  });
}
