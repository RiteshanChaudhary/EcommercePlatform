"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post('/add', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.create);
router.delete('/clear', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.clearCart);
router.get('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.getCartByUserId);
router.delete('/remove/:productId', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.removeItemFromCart);
exports.default = router;
