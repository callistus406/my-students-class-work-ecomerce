import express from "express";
import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import { PaystackController } from "../controller/paystack.controller";
import { InventoryController } from "../controller/inventory.controller";
import { CustomerController } from "../controller/customer.customer.controller";
import { UserController } from "../controller/user.controller";

const router = express.Router();
//authentication
router.post("/auth/pre-register", AuthController.preRegister);
router.post("/auth/register", AuthController.registration);
router.get("/auth/profile", authMiddleware as any, UserController.getUser);
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

//users
router.patch("/profile/update", UserController.updateProfile);
router.patch("/profile/password/update", UserController.updatePassword);
//customers
router.get("/customers", CustomerController.getAllCustomers);
router.get("/get-customer/:id", CustomerController.getCustomerById);
// paystack
router.post("/paystack/payment", PaystackController.initiatePayment as any);
router.get("/paystack/payment/:reference", PaystackController.verifyPayment);
router.post(
  "/paystack/callback",
  PaystackController.handleCallback.bind(PaystackController)
);

// inventory route section
router.post("/inventory/products", InventoryController.createProduct);
router.get("/inventory/products", InventoryController.getproduct as any);
router.get("/inventory/products/:id", InventoryController.findById as any);
router.delete("/inventory/products/:id", InventoryController.deleteProduct);
router.post("/inventory/product/:productId/rating", InventoryController.rating);

export default router;
