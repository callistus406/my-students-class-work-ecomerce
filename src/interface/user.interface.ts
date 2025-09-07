export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
}

export interface IVerifyUser {
  email: string;
  otp: string;
  is_Varified: true;
}

// Step: provide basic information
// step2: confirm account
// step3: login
