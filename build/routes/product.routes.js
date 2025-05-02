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
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("multer"));
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("../config/cloudinary.config");
const router = express_1.default.Router();
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinary,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: 'ecom/products',
            allowed_formats: ['jpeg', 'webp', 'jpg', 'png', 'svg'],
        };
    }),
});
const upload = (0, multer_1.default)({ storage: storage });
// create product
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), product_controller_1.create);
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), product_controller_1.update);
// delete product
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), product_controller_1.remove);
router.get("/", product_controller_1.getAll);
router.get("/:id", product_controller_1.getById);
exports.default = router;
