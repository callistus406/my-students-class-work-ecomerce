import express from "express";
import {
  authMiddleware,
  customerMiddleware,
  merchantMiddleware,
} from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import { MarketplaceController } from "../controller/marketplace.controller";
import { PaystackController } from "../controller/paystack.controller";
import { InventoryController } from "../controller/inventory.controller";
import { UserController } from "../controller/user.controller";
import { upload } from "../config/multer.config";

const router = express.Router();
//authentication
router.post("/auth/pre-register", AuthController.preRegister);
router.post("/auth/register", AuthController.registration);
router.get("/auth/profile", authMiddleware as any, UserController.getUser);
router.post("/auth/login", AuthController.login);
router.post(
  "/auth/upgrade-kyc",
  authMiddleware as any,
  merchantMiddleware as any,
  AuthController.verifyKyc
);

router.post("/auth/request-otp", AuthController.requestOtp);
router.post(
  "/auth/request-password-reset",
  AuthController.requestPasswordReset
);
router.post("/auth/reset-password", AuthController.resetPassword);

//users

router.patch(
  "/profile/update",
  upload.single("image") as any,
  authMiddleware as any,
  UserController.profileUpdate
);
router.patch(
  "/profile/password/update",
  authMiddleware as any,
  UserController.changePassword
);
// paystack
router.post("/paystack/payment", PaystackController.initiatePayment as any);
router.get("/paystack/payment/:reference", PaystackController.verifyPayment);
router.post(
  "/paystack/callback",
  PaystackController.handleCallback.bind(PaystackController)
);

// inventory route section
router.post(
  "/inventory/products",
  authMiddleware as any,
  // merchantMiddleware as any,
  upload.any() as any,
  InventoryController.createProduct
);
router.get("/inventory/products", InventoryController.getProducts);
router.get("/inventory/products/:id", InventoryController.findById);
router.delete(
  "/inventory/products/:id",
  authMiddleware as any,
  // merchantMiddleware as any,
  InventoryController.deleteProduct
);
router.post(
  "/inventory/product/rating",
  authMiddleware as any,
  // customerMiddleware as any,
  InventoryController.ratings
);
router.post(
  "/carts",
  authMiddleware as any,
  // customerMiddleware as any,
  MarketplaceController.updateCart as any
);
router.get(
  "/carts",
  authMiddleware as any,
  // customerMiddleware as any,
  MarketplaceController.getCart as any
);

router.post(
  "/orders",
  authMiddleware as any,
  // customerMiddleware as any,
  MarketplaceController.createOrder as any
);

router.post("/webhook", PaystackController.webhook as any);
export default router;
