import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";

const router = express.Router();

router.post("/pre-register", AuthController.preRegister);
router.post("/register", AuthController.registration);
router.get("/get-user", authMiddleware as any, AuthController.getUser);
router.get("/login", AuthController.login);
router.post("/upgrade-kyc", authMiddleware as any, AuthController.verifyKyc);
router.patch("/upgrade-role", AuthController.upgradeRole);

export default router;
