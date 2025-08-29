export interface Iotp extends Document {
  email: string;
  otp: number;
  createdAt: Date;
  expiresAt: Date;
}