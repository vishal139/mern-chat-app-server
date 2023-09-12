import express from "express";
import * as UserControllers from "../controllers/user.controller.js";
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.route("/").post(UserControllers.registerUser).get(protect, UserControllers.getAllUser);

router.route("/login").post(UserControllers.LoginUser);

router.route("/login").post(UserControllers.LoginUser);

export default router;
