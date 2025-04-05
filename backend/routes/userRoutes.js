import express from 'express'
import { getProfile, login, registerUser } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js'

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login)
userRouter.get("/profile", authUser, getProfile);
