export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVarified: boolean;
}

export interface IVerifyUser {
  email: string;
  otp: string;
}

// Step: provide basic information
// step2: confirm account
// step3: login
