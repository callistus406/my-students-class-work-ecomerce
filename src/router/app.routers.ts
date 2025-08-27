import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { UserController } from "../controller/user.controller";



const router = express.Router();

router.post("/register", UserController.registration);
router.get("/getuser", UserController.getUser);
router.get("/login", UserController.login);

export default router;