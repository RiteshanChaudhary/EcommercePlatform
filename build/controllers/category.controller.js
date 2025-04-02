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
exports.getById = exports.remove = exports.update = exports.getAll = exports.create = void 0;
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const category_model_1 = __importDefault(require("../models/category.model"));
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const category = yield category_model_1.default.create(body);
    res.status(201).json({
        status: "success",
        success: true,
        data: category,
        message: "Category created successfully!",
    });
}));
exports.getAll = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (query) {
        filter.$or = [
            {
                name: { $regex: query, $options: "i" },
            },
            {
                description: { $regex: query, $options: "i" },
            },
        ];
    }
    const categories = yield category_model_1.default.find(filter)
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 });
    const totalCount = yield category_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: categories,
            pagination
        },
        message: "Categories fetched successfully!",
    });
}));
exports.update = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.default("id is required", 404);
    }
    const category = yield category_model_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) {
        throw new errorhandler_middleware_1.default("Category not found", 404);
    }
    res.status(200).json({
        success: true,
        status: "success",
        data: category,
        message: "Category updated successfully!",
    });
}));
exports.remove = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.default("id is required", 404);
    }
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new errorhandler_middleware_1.default("Category not found", 404);
    }
    yield category_model_1.default.findByIdAndDelete(category._id);
    res.status(200).json({
        success: true,
        status: "success",
        data: category,
        message: "Category deleted successfully!",
    });
}));
exports.getById = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new errorhandler_middleware_1.default("id is required", 404);
    }
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new errorhandler_middleware_1.default("Category not found", 404);
    }
    res.status(200).json({
        success: true,
        status: "success",
        data: category,
        message: "Category fetched successfully!",
    });
}));
