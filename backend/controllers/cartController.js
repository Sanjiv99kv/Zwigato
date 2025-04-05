import { userModel } from '../models/userModel.js'

export const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        let userData = await userModel.findOne({ _id: userId })
        let cartData = await userData.cartData;
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        return res.json({ message: 'Item added to cart' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        let userData = await userModel.findOne({ _id: userId })
        let cartData = await userData.cartData;
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        return res.json({ message: 'Item added to cart' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const getCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        let userData = await userModel.findById(userId)
        let cartData = await userData.cartData;
        return res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}