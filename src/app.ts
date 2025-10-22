import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./router/app.routers";
import { PORT } from "./config/system.variable";
import { mongoConnection } from "./config/db.connections";
import { handleCustomError } from "./midddleware/errorHandler.midleware";
import { limiter } from "./utils/Rate-Limit";
import path from "path";

const app = express();

app.use(express.json());

// RateLimit in Windows
app.use(limiter);

// app.use(logger)
console.log(path.join(__dirname, "../uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", router);
app.use(handleCustomError);

mongoConnection();
app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});
