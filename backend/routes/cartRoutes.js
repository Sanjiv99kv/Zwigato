import express from 'express'
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';

export const cartRouter = express.Router();


cartRouter.post("/add",authUser, addToCart)
cartRouter.post("/remove",authUser, removeFromCart)
cartRouter.get("/get",authUser, getCart)