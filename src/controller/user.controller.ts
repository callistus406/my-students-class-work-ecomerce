import { Request, Response } from "express";
import { UserService } from "../services/user.services";



export class UserController {
    static getUser = async (req:Request, res:Response) => {
        const response = await UserService.getUser()
    res.status(200).json({
        message:"Success",
        data:response

    })
    };

    static addUser = async (req:Request, res:Response) => {
        
        try {
            req.body.email = req.body.email.toLowerCase();
            req.body.username = req.body.username.toLowerCase();
            
            const data = req.body;
            const response = await UserService.register(data)
        res.status(200).json({
            message:"Success",
            data:response
        })
        } catch (error:any) {
            res.status(401).json({
                message:"Bad request",
                data:error.message
            })
            
        }
        
    };

    static fetchUser = async (req:Request, res:Response) => {

        try {
        const {id} = req.params;
        const response = await UserService.fetchUser(id);
        res.status(200).json({
            message:"Success",
            data:response
             })
        } catch (error:any) {
            res.status(401).json({
                message:"Bad Request",
                data:error.message
            })

            
        }
    };

    static fetchByEmail = async (req:Request, res:Response) => {
        try {
            req.body.email = req.body.email.toLowerCase()
            const {email} = req.body
            const response = await UserService.fetchUserByEmail(email);
            res.status(200).json(response)
        } catch (error:any) {
            res.status(400).json(error.message)
        }
    };

    static updateById = async (req:Request, res:Response) => {
             let {id} = req.params;
            const updateData = req.body
        try {
            const response = await UserService.updateById(id, updateData)
            res.status(200).json({
                message:"Success",
                data:response
            })
        } catch (error:any) {
            res.status(400).json({
                message:"Bad request",
                data:error.message
            })
            
        }
    };

    static updateLocation =async (req:Request, res:Response) =>{
        req.body.email = req.body.email.toLowerCase()
        try {
            const {email, country} = req.body
            const response = await UserService.updateByEmail(email, country);
            res.status(200).json({
                message:"Success",
                data:response
            })
        } catch (error:any) {
            res.status(400).json({
                message:"Bad request",
                data:error.message
            })
        }
    }

    static deleteUser = async (req:Request, res:Response) => {
        try {
            const {id} = req.params;
            const response = await UserService.deleteUser(id)
            res.status(201).json({
                message:"Success",
                data: response
            })
        } catch (error:any) {
            res.status(400).json(error.message)
            
        }
    };

    static login = async (req:Request,res:Response ) =>{
        req.body.email = req.body.email.toLowerCase();
        try {
             const {email, password} = req.body
             const response = await UserService.login(email, password)
            res.status(200).json(response)
        } catch (error:any) {
            res.status(400).json({
                message:"Bad Request",
                data:error.message
            })


            
        }
       
    }
}