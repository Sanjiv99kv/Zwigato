import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, requried: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }
})

export const orderModel = mongoose.model.order || mongoose.model("order",orderSchema);


