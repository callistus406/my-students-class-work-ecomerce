import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./router/app.routers";
import { mongoConnection } from "./config/db.connections";
import { handleCustomError } from "./midddleware/errorHandler.midleware";

const app = express();

app.use(express.json());

// app.use(logger)
app.use("/api/v1", router);
app.use(handleCustomError);

mongoConnection();
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is connected on port ${process.env.APP_PORT}`);
});
