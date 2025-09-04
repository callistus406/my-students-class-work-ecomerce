import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { AppController } from "../controller/user.controller";

const router = express.Router();

router.post("/preregister", AppController.preRegister);
router.post("/register", AppController.registration);
router.get("/getuser", AppController.getUser);
router.get("/login", AppController.login);

export default router;
