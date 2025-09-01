export interface Iotp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}