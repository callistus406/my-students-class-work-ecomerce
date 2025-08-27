import express from "express";

import { authMiddleware } from "../midddleware/auth.middleware";
import { UserController } from "../controller/user.controller";



const router = express.Router();

router.post("/register", UserController.registration)

//router.get('/getUsers', authMiddleware, UserController.getUser) 

//router.post("/login", UserController.login)

//router.post('/add-user', UserController.addUser)

//router.get("/fetch-user-by-email", UserController.fetchByEmail)
//router.get("/fetch/:id", UserController.fetchUser)

//router.put("/update-by-id/:id", UserController.updateById)
//router.put("/update-location", UserController.updateLocation)
//router.delete("/delete/:id", UserController.deleteUser)

export default router;