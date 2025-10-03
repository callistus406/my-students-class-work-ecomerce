import { Types } from "mongoose";

export interface IUpload {
  userId: Types.ObjectId;
  filePath: string;
}
