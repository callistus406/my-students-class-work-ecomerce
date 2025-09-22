import express from "express";
import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import { PaystackController } from "../controller/auth.paystack";
import { appController } from "../controller/product.controller";

const router = express.Router();
//authentication
router.post("/auth/pre-register", AuthController.preRegister);
router.post("/auth/register", AuthController.registration);
router.get("/auth/profile", authMiddleware as any, AuthController.getUser);
router.get("/auth/login", AuthController.login);
router.post(
  "/auth/upgrade-kyc",
  authMiddleware as any,
  AuthController.verifyKyc
);
router.post("/auth/request-otp", AuthController.requestOtp);
router.post(
  "/auth/request-password-reset",
  AuthController.requestPasswordReset
);
router.post("/auth/reset-password", AuthController.resetPassword);

// paystack
router.post("/initiate-payment", PaystackController.initiatePayment);
router.get("/verify-payment/:reference", PaystackController.verifyPayment);
router.post(
  "/paystack/callback",
  PaystackController.handleCallback.bind(PaystackController)
);

// inventory route section
router.post("/create-inventory", appController.createInventory);
router.get("/inventories", appController.getinventory);
router.get("/inventory/:id", appController.findById as any);
router.post("/create-product", appController.createProduct);
router.get("/products", appController.getproduct as any);
router.delete("/product/:id", appController.deleteProduct);
router.get("/search-product", appController.findProductByName);

export default router;
