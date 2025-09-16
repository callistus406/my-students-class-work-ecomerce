import axios from "axios";

export interface IInitializeTransaction {
  email: string;
  amount: number;
  callback_url?: string;
}

export interface IVerifyPayment {
  email: string;
  amount: number;
  reference?: any;
}

const API_URL = "https://api.paystack.co";
const API_KEY = process.env.TEST_KEY;

export class Paystack {
  static async initializeTransaction(data: IInitializeTransaction) {
    console.log(data);
    const response = await axios.post(
      `${API_URL}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${API_KEY} `,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  }

  static async verifyPayment(reference: string) {
    const response = await axios.get(
      `${API_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}
