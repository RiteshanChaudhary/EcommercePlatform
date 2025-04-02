"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
//place new order
router.post('/place', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.placeOrder);
// get all order
router.get('/', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), order_controller_1.getAllOrder);
//get order by userId 
router.get('/user', order_controller_1.getByUserId);
//update order status 
router.put('/:id/status', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), order_controller_1.updateOrderStatus);
//delete an order
router.delete('/:id', order_controller_1.deleteOrder);
//cancel and order 
router.put('/:orderId/cancel/:productId?', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.cancelOrder);
exports.default = router;
