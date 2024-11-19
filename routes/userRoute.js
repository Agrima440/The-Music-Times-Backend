import express from "express";
import { loginController,  registerUser,  usersController } from "../controllers/authController.js"
import { checkRole,  requireSignIn } from "../middlewares/authMiddleware.js";
import passport from "passport";

const router=express.Router()

router.post("/register",registerUser)
router.post("/login",loginController)
router.get("/all",requireSignIn,checkRole(["admin"]), usersController)
