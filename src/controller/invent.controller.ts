import { InventoryService } from "../services/inventory.services";
import { Request, Response } from "express";

export class InventController {
    static createInventory = async(req:Request, res:Response) =>{
        try {
            const data = req.body;
            const response = await InventoryService.createInventory(data);
            res.status(200).json({success:true, payload:response})
        } catch (error:any) {
            res.status(400).json({
                success: false,
                message:error.message || "Something went wrong",
            })
            
        }

    }

    // product creation controller
    static createProduct = async(req:Request, res:Response) => {
        try {
            const data = req.body.data;
            const response = await InventoryService.createProduct(data);
            res.status(200).json({success:true, payload:response})
        } catch (error:any) {
            console.log(error)
            res.status(400).json({
                success: false,
                message:error.message || "Something went wrong",
            })
        }

    }
  // update product controller
    static updateProduct = async(req:Request, res:Response) =>{
        try {
            const id = req.params.id;
            const response = await InventoryService.updateProduct(id);
            res.status(200).json({success:true, payload:response})
        } catch (error:any) {
            res.status(400).json({
                success: false,
                message:error.message || "Something went wrong",
            })
        }

    }

    // delete product controller
    static deleteProduct = async(req:Request, res:Response) =>{
        try {
            const id = req.params.id;
            const response = await InventoryService.deleteProduct(id);
            res.status(200).json({success:true, payload:response})
        } catch (error:any) {
            res.status(400).json({
                success: false,
                message:error.message || "Something went wrong",
            })
        }

    }

}