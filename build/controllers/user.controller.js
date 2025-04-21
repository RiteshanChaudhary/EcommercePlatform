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
exports.login = exports.update = exports.register = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const jwt_util_1 = require("../utils/jwt.util");
const global_types_1 = require("../@types/global.types");
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.getAll = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, query, role, gender } = req.query;
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    // Filter by role
    if (role) {
        filter.role = role;
    }
    // Filter by gender
    if (gender) {
        filter.gender = gender;
    }
    // Text search query
    if (query) {
        filter.$or = [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { phoneNumber: { $regex: query, $options: 'i' } }
        ];
    }
    filter.role = global_types_1.Role.user;
    const users = yield user_model_1.default.find(filter)
        .select('-password') // Exclude password from results
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 });
    const totalCount = yield user_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: users,
            pagination,
        },
        message: "Users fetched successfully",
    });
}));
exports.register = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.password) {
        throw new errorhandler_middleware_1.default("password is required", 400);
    }
    const hashedPassword = yield (0, bcrypt_util_1.hash)(body.password);
    console.log("👊 ~ user.controller.ts:11 ~ register ~ hashedPassword:", hashedPassword);
    //
    body.password = hashedPassword;
    const user = yield user_model_1.default.create(body);
    // const user = new User()
    res.status(201).json({
        status: "success",
        success: true,
        message: "User registered successfully",
        data: user,
    });
}));
exports.update = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { firstName, lastName, gender, phoneNumber } = req.body;
    const user = yield user_model_1.default.findByIdAndUpdate(id, {
        firstName,
        lastName,
        gender,
        phoneNumber,
    }, { new: true });
    if (!user) {
        throw new errorhandler_middleware_1.default("User not found", 404);
    }
    res.status(201).json({
        status: "success",
        success: true,
        message: "User registered successfully",
        data: user,
    });
}));
exports.login = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. email pass <-- body
    const { email, password } = req.body;
    if (!email) {
        throw new errorhandler_middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new errorhandler_middleware_1.default("Password is required", 400);
    }
    // 2.const user= user.findOne({email:email})
    const user = yield user_model_1.default.findOne({ email });
    // 3 if !user ->  error
    if (!user) {
        throw new errorhandler_middleware_1.default("Email or password does not match", 400);
        return;
    }
    // 4. compare hash
    const isMatch = yield (0, bcrypt_util_1.compare)(password, user.password);
    if (!isMatch) {
        throw new errorhandler_middleware_1.default("Email or password does not match", 400);
        return;
    }
    const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };
    const token = (0, jwt_util_1.generateToken)(payload);
    console.log("👊 ~ user.controller.ts:151 ~ login ~ token:", token);
    res
        .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .json({
        status: "success",
        success: true,
        message: "Login success",
        token,
        user,
    });
}));
