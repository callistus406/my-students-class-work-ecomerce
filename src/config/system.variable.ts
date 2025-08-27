import dotenv from "dotenv";
dotenv.config();

export const dburl = process.env.DB_CONNECTION_URL as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const PORT = process.env.PORT 
