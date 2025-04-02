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
exports.getReviewByProductId = exports.remove = exports.update = exports.getAll = exports.create = void 0;
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = req.user;
    const { productId, rating } = body;
    if (!productId) {
        throw new errorhandler_middleware_1.default("userId and productId is required", 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.default("Product not found", 404);
    }
    const newReview = yield review_model_1.default.create(Object.assign(Object.assign({}, body), { product: productId, user: user._id }));
    product.reviews.push(newReview._id);
    console.log(product === null || product === void 0 ? void 0 : product.averageRating, rating);
    const totalRating = (product === null || product === void 0 ? void 0 : product.averageRating) * (product.reviews.length - 1) +
        Number(rating);
    product.averageRating = totalRating / product.reviews.length;
    yield product.save();
    res.status(201).json({
        status: "success",
        success: true,
        data: newReview,
        message: "Review created successfully!",
    });
}));
exports.getAll = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query, rating, product } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (rating) {
        filter.rating = parseInt(rating);
    }
    if (product) {
        filter.product = product;
    }
    if (query) {
        filter.$or = [
            {
                review: { $regex: query, $options: "i" },
            },
        ];
    }
    const reviews = yield review_model_1.default.find(filter)
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 })
        .populate("product")
        .populate("user");
    const totalCount = yield review_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: reviews,
            pagination
        },
        message: "Reviews fetched successfully!",
    });
}));
// update
exports.update = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, review } = req.body;
    if (typeof rating !== "number") {
        throw new errorhandler_middleware_1.default("Review must be a number type", 400);
    }
    const id = req.params.Identifier;
    const oldReview = yield review_model_1.default.findById(id);
    if (!oldReview) {
        throw new errorhandler_middleware_1.default("Review not found", 404);
    }
    const product = yield product_model_1.default.findById(review.product);
    if (!product) {
        throw new errorhandler_middleware_1.default("Product not found", 404);
    }
    const newRating = Number(product.averageRating) * product.reviews.length -
        oldReview.rating +
        Number(rating);
    product.averageRating = newRating / product.reviews.length;
    yield product.save();
    const newReview = yield review_model_1.default.findByIdAndUpdate(id, { rating, review }, { new: true });
    res.status(200).json({
        success: true,
        status: "success",
        data: newReview,
        message: "Review updated successfully!",
    });
}));
// delete
exports.remove = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const review = yield review_model_1.default.findById(id);
    if (!review) {
        throw new errorhandler_middleware_1.default("Review not found", 404);
    }
    const product = yield product_model_1.default.findById(review.product);
    product.reviews.pull(review._id);
    if (product.reviews.length === 0) {
        product.averageRating = 0;
    }
    else {
        product.averageRating =
            (Number(product.averageRating) * (product.reviews.length + 1) -
                review.rating) /
                product.reviews.length;
    }
    yield review_model_1.default.findByIdAndDelete(review._id);
    yield product.save();
    res.status(200).json({
        success: true,
        status: "success",
        data: review,
        message: "Review deleted successfully",
    });
}));
// get reviews by product id
exports.getReviewByProductId = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const reviews = yield review_model_1.default.find({ product: productId }).populate("user");
    res.status(200).json({
        success: true,
        status: "success",
        data: reviews,
        message: "Review fetched successfully"
    });
}));
