import { Inventory } from "../models/invent.model";
import { IProduct } from "../interface/product.interface";
import { productModel } from "../models/product.model";

export class InventController {
    static createInventory = async (data:{quantity:number, location:string}) => {
         const response = (await Inventory.create(data));
         if (!response) return null;
         return response;
    }
    // product creations
    static createProduct = async (data: IProduct) => {
        const response = await productModel.create(data);
        if (!response) return null;
        return response;
    }
    // update product by id
    static updateProduct = async (id: string) => {
        const response = await productModel.findByIdAndUpdate(id, { new: true });
        if (!response) return null;
        return response;
    };
    // find and delete product by id
    static findanddelete = async(id:string) =>{
        const response = await productModel.findByIdAndDelete(id);
        if(!response) return null;
        return response;
    }
}