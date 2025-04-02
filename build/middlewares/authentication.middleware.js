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
exports.Authenticate = void 0;
const errorhandler_middleware_1 = __importDefault(require("./errorhandler.middleware"));
const jwt_util_1 = require("../utils/jwt.util");
const user_model_1 = __importDefault(require("../models/user.model"));
const Authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["authorization"];
            console.log("👊 ~ authentication.middleware.ts:15 ~ return ~ token:", req.headers["authorization"]);
            if (!authHeader || !authHeader.startsWith("BEARER")) {
                throw new errorhandler_middleware_1.default("Unauthorized, Authorization header is missing", 401);
            }
            const access_token = authHeader.split(" ")[1];
            console.log("👊 ~ authentication.middleware.ts:23 ~ return ~ access_token:", access_token);
            if (!access_token) {
                throw new errorhandler_middleware_1.default("Unauthorized, token is missing", 401);
            }
            const decoded = (0, jwt_util_1.verifyToken)(access_token);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                throw new errorhandler_middleware_1.default("Unauthorized, access denied", 401);
            }
            console.log("👊 ~ authentication.middleware.ts:27 ~ return ~ decoded:", decoded);
            if (!decoded) {
                throw new errorhandler_middleware_1.default("Unauthorized, Invalid token", 401);
            }
            const user = yield user_model_1.default.findById(decoded._id);
            if (!user) {
                throw new errorhandler_middleware_1.default("User not found", 404);
            }
            if (roles && !roles.includes(user.role)) {
                throw new errorhandler_middleware_1.default(`Forbidden, ${user.role} can not access this resource`, 401);
            }
            // ts-expect-error
            req.user = {
                _id: decoded._id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role,
                email: decoded.email,
            };
            next();
        }
        catch (err) {
            // throw new CustomError(err?.message ?? "Something wend wrong", 500);\
            next(err);
        }
    });
};
exports.Authenticate = Authenticate;
