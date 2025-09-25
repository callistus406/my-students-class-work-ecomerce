import express from "express";
import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import { PaystackController } from "../controller/auth.paystack";
import { InventoryController } from "../controller/inventory.controller";
import { AuthCstController } from "../controller/auth.customer.controller";

const router = express.Router();
//authentication
router.post("/auth/pre-register", AuthController.preRegister);
router.post("/auth/register", AuthController.registration);
router.get("/auth/profile", authMiddleware as any, AuthController.getUser);
router.get("/auth/login", AuthController.login);
router.get("/customers", AuthCstController.getAllCustomers);
router.get("/get-customer/:id", AuthCstController.getCustomerById);
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
router.post("/inventory/products", InventoryController.createProduct);
router.get("/inventory/products", InventoryController.getproduct as any);
router.get("/inventory/products/:id", InventoryController.findById as any);
router.delete("/inventory/products/:id", InventoryController.deleteProduct);
router.post(
  "/inventory/product/:productId/rating",
  InventoryController.rateProduct
);

export default router;
