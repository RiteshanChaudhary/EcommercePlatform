"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const router = express_1.default.Router();
// add to wishlist
router.post('/', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.create);
// clear wishlist
router.delete('/', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.clearWishlist);
// get users wishlist
router.get('/', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.getUserWishlist);
// remove product from list
router.delete('/remove/:productId', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.removeProductFromList);
exports.default = router;
