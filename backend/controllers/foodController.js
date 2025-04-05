import { foodModel } from '../models/foodModel.js'
import { v2 as cloudinary } from 'cloudinary';

export const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const imageFile = req.file;

        if (!name || !description || !price || !category) {
            return res.json({ success: false, message: "Missing details" })
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const food = new foodModel({
            name,
            description,
            price,
            category,
            image: imageUrl
        })

        await food.save();
        return res.json({ success: true, message: "Food added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export const removeFood = async (req, res) => {
    try {
        const { foodId } = req.body;
        await foodModel.findByIdAndDelete(foodId)
        return res.json({success:true,message:"Food removed"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}