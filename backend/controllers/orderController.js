import { orderModel } from '../models/orderModel.js'
import { userModel } from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe("sk_test_51PzVZhP2ox7QBZEwqGSdqf4bZ0MNMAR8LmxkuGwNsfCLhAWQkt9bOQWPwRi2AFxv4A9owXCWnuLn8EClvwKbMF1Z00bOAIDH90")

export const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173"
    try {
        const { userId, items, amount, address, paymentMode } = req.body;

        if (paymentMode === "Cash") {
            const newOrder = new orderModel({
                userId,
                items,
                amount,
                address,
                payment: true
            })
            await newOrder.save();
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            return res.json({ success: true, paymentMode: "cash", message: "Order Booked" })
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 49 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })


        return res.json({
            success: true,
            session_url: session.url
        })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const verifyOrder = async (req, res) => {
    try {
        const { success, orderId } = req.body;
        if (success) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: true, message: "Failed" })
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const userOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId: userId })
        return res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        return res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status: status })
        return res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}