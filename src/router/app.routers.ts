import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { AppController } from "../controller/auth.controller";

const router = express.Router();

router.post("/preregister", AppController.preRegister);
router.post("/register", AppController.registration);
router.get("/getuser", AppController.getUser);
router.get("/login", AppController.login);
router.post("/request-otp", AppController.requestOtp);
router.post("/request-password-reset", AppController.requestPasswordReset);
router.post("/reset-password", AppController.resetPassword);

export default router;
