
export interface IUsers{
  id: string;
  email: string;
  password: string;
  role: string;
  isVarified: boolean;
  createdAt: Date;
  updatedAt: Date;
}