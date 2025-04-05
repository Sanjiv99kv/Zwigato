import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import upload from '../middlewares/multer.js'

export const foodRouter = express.Router();

foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);
