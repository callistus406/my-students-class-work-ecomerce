import express from "express";
import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import { PaystackController } from "../controller/auth.paystack";
import { appController } from "../controller/product.controller";
import { cartController } from "../controller/cart.controller";

const router = express.Router();

router.post("/pre-register", AuthController.preRegister);
router.post("/register", AuthController.registration);
router.get("/get-user", authMiddleware as any, AuthController.getUser);
router.get("/login", AuthController.login);
router.post("/upgrade-kyc", authMiddleware as any, AuthController.verifyKyc);
router.post("/request-otp", AuthController.requestOtp);
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/reset-password", AuthController.resetPassword);
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

// cart routes
router.post("/create-cart", cartController.createCart);
//router.post("/add-item-to-cart", appController.addItemToCart);

export default router;
