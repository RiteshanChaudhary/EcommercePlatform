"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromCart = exports.clearCart = exports.getCartByUserId = exports.create = void 0;
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const product_model_1 = __importDefault(require("../models/product.model"));
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const cart_model_1 = require("../models/cart.model");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, quantity } = req.body;
    let cart;
    if (!userId) {
        throw new errorhandler_middleware_1.default('userId is required', 400);
    }
    if (!productId) {
        throw new errorhandler_middleware_1.default('productId is required', 400);
    }
    cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        cart = new cart_model_1.Cart({ user: userId, items: [] });
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.default('product not found', 404);
    }
    const existingProduct = cart.items.find((item) => item.product.toString() === productId);
    if (existingProduct) {
        existingProduct.quantity += Number(quantity);
        cart.items.push(existingProduct);
    }
    else {
        cart.items.push({ product: productId, quantity });
    }
    yield cart.save();
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Product added to cart',
        data: cart
    });
}));
exports.getCartByUserId = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract pagination parameters from the query
    const { limit, page } = req.query;
    // Set default values for pagination
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    // Get the user ID from the request parameters
    const userId = req.params.id;
    // Find the cart for the user
    const cart = yield cart_model_1.Cart.findOne({ user: userId })
        .populate('user', '-password') // Populate the user field (excluding password)
        .populate({
        path: 'items.product', // Populate the product field in the items array
        select: 'name price description', // Select specific fields from the Product model
    });
    // If the cart is not found, throw an error
    if (!cart) {
        throw new errorhandler_middleware_1.default('Cart not found', 404);
    }
    // Get the total number of items in the cart
    const totalCount = cart.items.length;
    // Paginate the items array
    const paginatedItems = cart.items.slice(skip, skip + queryLimit);
    // Create a new cart object with paginated items
    const paginatedCart = Object.assign(Object.assign({}, cart.toObject()), { items: paginatedItems });
    // Calculate pagination metadata
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    // Send the response with the paginated cart
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Cart fetched successfully',
        data: {
            data: paginatedCart, // Paginated cart data
            pagination, // Pagination metadata
        },
    });
}));
exports.clearCart = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new errorhandler_middleware_1.default('Cart does not created yet.', 400);
    }
    yield cart_model_1.Cart.findOneAndDelete({ user: userId });
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Cart cleared successfully',
        data: null
    });
}));
exports.removeItemFromCart = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.user._id;
    if (!productId) {
        throw new errorhandler_middleware_1.default('productId is required', 400);
    }
    const cart = yield cart_model_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new errorhandler_middleware_1.default('Cart does not created yet.', 400);
    }
    // cart.items = cart.items.filter((item)=>item.product.toString() !== productId)
    cart.items.pull({ product: productId });
    const updatedCart = yield cart.save();
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Cart updated successfully',
        data: updatedCart
    });
}));
