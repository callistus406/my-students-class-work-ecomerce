import dotenv from "dotenv";
dotenv.config();

export const dburl = process.env.DB_CONNECTION_URL as string;