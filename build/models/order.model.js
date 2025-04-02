"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        default: () => `ORD -${(0, uuid_1.v4)().split("-")[0]}`,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'cancelled', 'delivered', 'processing'],
        default: 'pending',
    },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });
const Order = (0, mongoose_1.model)('order', orderSchema);
exports.default = Order;
