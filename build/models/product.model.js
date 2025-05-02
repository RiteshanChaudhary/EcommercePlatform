"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "price is required"],
        min: [0, "price should be greater than 0"],
    },
    description: {
        type: String,
        required: false,
        min: [50, "description should be at least 50 character long"],
        trim: true,
    },
    coverImage: {
        public_id: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            path: {
                type: String,
                required: true,
            }
        },
    ],
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: [true, "Author is required"],
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
    },
    reviews: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "review",
            required: false,
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
    wishLists: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
    ],
}, { timestamps: true });
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
