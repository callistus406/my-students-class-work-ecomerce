import { InventoryService } from "../services/inventory.services";
import { Request, Response } from "express";
import mongoose from "mongoose";

export class InventController {
  static createInventory = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const response = await InventoryService.createInventory(data);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  static getinventory = async (req: Request, res: Response) => {
    try {
      const item = await InventoryService.getinventory();
      res.status(200).json({ success: true, payload: item });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static findById = async (req: Request, res: Response) => {
    try {
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    const item = await InventoryService.findById(objectId);

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


  // product creation controller
  static createProduct = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      const response = await InventoryService.createProduct(data);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };
  // update product controller
  static updateProduct = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const response = await InventoryService.updateProduct(id);
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
      const response = await InventoryService.deleteProduct(id);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };
}
