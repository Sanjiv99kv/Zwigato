import express from 'express'
import authUser from '../middlewares/authUser.js'
import { listOrders, placeOrder, updateStatus, userOrder, verifyOrder } from '../controllers/orderController.js';

export const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authUser, userOrder);
orderRouter.get("/list", listOrders);
orderRouter.post("/status",updateStatus);