import {productService} from "../services/product.services";
import { Request, Response } from "express";
import mongoose from "mongoose";

export class appController {
  static createInventory = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const response = await productService.createInventory(data);
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
      const item = await productService.getinventory();
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

  // get product
  static getproduct = async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
       
      } = req.query as {
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

  static findProductByName = async (req:Request, res:Response) =>{
    try {
      const {productName} = req.body;
      const response = await productService.findProductByName(productName);
      res.status(200).json({success:true, payload:response})
      
    } catch (error:any) {
      res.status(400).json({
        success:false,
        message:error.message,
      })
      
    }
  }

}
