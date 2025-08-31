
export interface preRegister{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
   role: "merchant" | "customer";
  isVarified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsers{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "merchant" | "customer";
  otp: string;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;  
}