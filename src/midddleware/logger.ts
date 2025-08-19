import { Request, Response, NextFunction } from "express"


export const logger = (req:Request, res:Response, next:NextFunction)=> {

    console.warn(`This request was sent by ${req.ip}, at ${new Date()}`)
    next()
}