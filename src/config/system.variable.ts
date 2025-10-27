import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { throwCustomError } from "../midddleware/errorHandler.midleware";

export const dburl = process.env.DB_CONNECTION_URL as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const PORT = process.env.PORT;
export const JWT_EXP = process.env.JWT_EXP;
export const JWT_ADMIN_KEY = process.env.JWT_ADMIN_KEY;
export const algorithm = process.env.ALGORITHM as string;

const keyBase64 = process.env.KEY_BASE64;
const ivBase64 = process.env.IV_BASE64;
export const API_KEY = process.env.API_KEY;

if (!keyBase64 || !ivBase64) {
  throw throwCustomError("KEY_BASE64 or IV_BASE64 is missing in env", 422);
}

export const key = Buffer.from(keyBase64, "base64");
export const iv = Buffer.from(ivBase64, "base64");
