"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const global_types_1 = require("../@types/global.types");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const router = express_1.default.Router();
// private routes
// create category
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), category_controller_1.create);
// update category
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), category_controller_1.update);
// delete category
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), category_controller_1.remove);
// public routes
// get all category
router.get("/", category_controller_1.getAll);
// get category by id
router.get("/:id", category_controller_1.getById);
exports.default = router;
