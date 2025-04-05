import express from 'express';
import cors from 'cors'
import { connectDB } from './config/mongodb.js';
import dotenv from 'dotenv'
import { foodRouter } from './routes/foodRouter.js';
import connectCloudinary from './config/cloudinary.js';
import { userRouter } from './routes/userRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRouter.js';
dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 4000;
await connectDB();
await connectCloudinary();

//middlewares
app.use(cors())
app.use(express.json())


//app routes
app.get("/",(req,res)=>{
    res.send("API working")
})

//api endpoints
app.use("/api/food",foodRouter);
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.listen((port),(err)=>{
    if(!err) console.log(`Running on http://localhost:${port}`)
})