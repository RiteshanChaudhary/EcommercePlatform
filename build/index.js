"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// import "./@types/express"
const express_1 = __importDefault(require("express"));
const database_config_1 = require("./config/database.config");
const path_1 = __importDefault(require("path"));
const errorhandler_middleware_1 = __importDefault(require("./middlewares/errorhandler.middleware"));
// importing routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI || "";
(0, database_config_1.connectDatabase)(DB_URI);
// using middlewares
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
// serving static files
app.use("/api/uploads", express_1.default.static(path_1.default.join(__dirname, "../", "uploads")));
app.use("/", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});
console.log("👊 ~ index.ts:23 ~ __dirname:", __dirname);
// using routes
app.use("/api/user", user_routes_1.default);
app.use("/api/product", product_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/review", review_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/wishlist', wishlist_routes_1.default);
app.use('/api/order', order_routes_1.default);
// handle not found path
app.all("*", (req, res, next) => {
    const message = `can not ${req.method} on ${req.originalUrl}`;
    const error = new errorhandler_middleware_1.default(message, 404);
    next(error);
});
// error handler
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    const message = error.message || "Something went wrong";
    res.status(statusCode).json({
        status,
        success: false,
        message,
    });
});
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
