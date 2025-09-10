import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";
import {InventController} from "../controller/invent.controller";

const router = express.Router();

router.post("/pre-register", AuthController.preRegister);
router.post("/register", AuthController.registration);
router.get("/get-user", authMiddleware as any, AuthController.getUser);
router.get("/login", AuthController.login);
router.post("/upgrade-kyc", authMiddleware as any, AuthController.verifyKyc);
router.post("/request-otp", AuthController.requestOtp);
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/reset-password", AuthController.resetPassword);

// inventory route section
router.post("/inventory",InventController.createInventory);
router.post("/product",InventController.createProduct);
router.delete("/product/:id",InventController.deleteProduct);

export default router;
