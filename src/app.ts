import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./router/app.routers";
import { logger } from "./midddleware/logger";
import { mongoConnection } from "./config/db.connections";


const app = express()
const port = 3000

app.use(express.json());

app.use(logger)
app.use("/api/v1",router)

mongoConnection()
app.listen(port, ()=>{
    console.log(`Server is connected to ${port}`)
})

