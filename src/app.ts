import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./router/app.routers";
import { logger } from "./midddleware/logger";
import { mongoConnection } from "./config/db.connections";


const app = express()

app.use(express.json());

app.use(logger)
app.use(router)

mongoConnection()
app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server is connected to ${process.env.APP_PORT}`)
})

