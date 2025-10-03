import express from "express";
import { authMiddleware } from "../midddleware/auth.middleware";
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
router.patch(
  "/profile/update",
  upload.single("file") as any,
  authMiddleware as any,
  UserController.updateProfile
);
router.patch(
  "/profile/password/update",
  authMiddleware as any,
  UserController.changePassword
);

router.post(
  "/upload",
  upload.single("file") as any,
  authMiddleware as any,
  UserController.updatePicture
);
// paystack
router.post("/paystack/payment", PaystackController.initiatePayment as any);
router.get("/paystack/payment/:reference", PaystackController.verifyPayment);
router.post(
  "/paystack/callback",
  PaystackController.handleCallback.bind(PaystackController)
);

// inventory route section
router.post("/inventory/products", InventoryController.createProduct);
router.get("/inventory/products", InventoryController.getProducts);
router.get("/inventory/products/:id", InventoryController.findById);
router.delete("/inventory/products/:id", InventoryController.deleteProduct);
router.post(
  "/inventory/product/rating",
  authMiddleware as any,
  InventoryController.ratings
);
router.post("/cart/create", MarketplaceController.createCart as any);
//router.post("/cart/add", cartController.addToCart);
//router.get("/cart/:userId", cartController.getCart);
//router.delete("/cart/remove/:userId/:productId", cartController.removeFromCart);

export default router;
