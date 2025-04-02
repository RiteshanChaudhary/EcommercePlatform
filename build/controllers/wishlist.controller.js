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
exports.clearWishlist = exports.getUserWishlist = exports.removeProductFromList = exports.create = void 0;
const asyncHandler_util_1 = require("../utils/asyncHandler.util");
const errorhandler_middleware_1 = __importDefault(require("../middlewares/errorhandler.middleware"));
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
//add to wishlist 
// export const addToWishlist = asyncHandler(async(req: Request, res:Response) => {
//     const productId= req.params.id; 
//     const user = req.user;
//     if(!productId) {
//         throw new CustomError('Product Id is required', 404)
//     }
//     const product = await Product.findById(productId);
//     if(!product) {
//         throw new CustomError('Product not found', 404);
//     }
//     const userDocument = await User.findById(user._id)
//     if(!userDocument) {
//         throw new CustomError('user not found',404);
//     }
//                 //if product exists already in watchlist
//     if(userDocument.wishlist.some(item => item.toString() === productId)) {
//         throw new CustomError('Product already in wishlist', 400);
//     }
//     userDocument.wishlist.push(new mongoose.Types.ObjectId(productId));
//     await userDocument.save();
//     res.status(200).json({
//         status: 'success',
//         success: true,
//         message: 'Product added to wishlist successfully!'
//     })
// })
// // Remove product from wishlist
// export const removeFromWishlist = asyncHandler(async(req: Request, res:Response) => {
//     const productId = req.params.id;
//     const user = req.user;
//     if(!productId) {
//         throw new CustomError('Product Id is required', 400);
//     }
//     const userDocument = await User.findById(user._id);
//     if(!userDocument) {
//         throw new CustomError('User not found', 404);
//     }
//     // Check if product exists in wishlist
//     if(!userDocument.wishlist.some(item => item.toString() === productId)) {
//         throw new CustomError('Product not in wishlist', 404);
//     }
//     // Remove product from wishlist
//     userDocument.wishlist = userDocument.wishlist.filter(
//         item => item.toString() !== productId
//     );
//     await userDocument.save();
//     res.status(200).json({
//         status: 'success',
//         success: true,
//         message: 'Product removed from wishlist successfully!'
//     });
// });
// // Get user's wishlist
// export const getWishlist = asyncHandler(async(req: Request, res:Response) => {
//     const user = req.user;
//     const userDocument = await User.findById(user._id).populate('wishList');
//     if(!userDocument) {
//         throw new CustomError('User not found', 404);
//     }
//     res.status(200).json({
//         status: 'success',
//         success: true,
//         data: userDocument,
//         message: 'Wishlist fetched successfully!'
//     });
// });
// // Clear entire wishlist
// export const clearWishlist = asyncHandler(async(req: Request, res:Response) => {
//     const user = req.user;
//     const userDocument = await User.findById(user._id);
//     if(!userDocument) {
//         throw new CustomError('User not found', 404);
//     }
//     userDocument.wishlist = [];
//     await userDocument.save();
//     res.status(200).json({
//         status: 'success',
//         success: true,
//         message: 'Wishlist cleared successfully!'
//     });
// });
exports.create = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new errorhandler_middleware_1.default('User not found', 404);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.default('Product not found', 404);
    }
    const existingProduct = user.wishlist.find((list) => list.toString() === productId);
    if (!existingProduct) {
        user.wishlist.push(productId);
    }
    yield user.save();
    res.status(201).json({
        status: 'success',
        success: true,
        data: user.wishlist,
        message: 'Product added to wishlist successfully!'
    });
}));
exports.removeProductFromList = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const productId = req.params.productId;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new errorhandler_middleware_1.default('User not found', 404);
    }
    const existingProduct = user.wishlist.find((list) => list.toString() === productId);
    if (!existingProduct) {
        throw new errorhandler_middleware_1.default('Product does not exists in list', 404);
    }
    user.wishlist.filter((list) => list.toString() !== productId);
    yield user.save();
    res.status(200).json({
        status: 'success',
        success: true,
        data: user.wishlist,
        message: 'Product removed from wishlist successfully!'
    });
}));
exports.getUserWishlist = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract pagination parameters from the query
    const { limit, page } = req.query;
    // Set default values for pagination
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    // Get the authenticated user from the request
    const user = req.user;
    // Find the user document
    const userDocument = yield user_model_1.default.findById(user._id);
    // If the user is not found, throw an error
    if (!userDocument) {
        throw new errorhandler_middleware_1.default('User not found', 404);
    }
    // Get the total number of items in the wishlist
    const totalCount = userDocument.wishlist.length;
    // Paginate the wishlist
    const paginatedWishlist = userDocument.wishlist.slice(skip, skip + queryLimit);
    // Populate the paginated wishlist items
    const populatedWishlist = yield product_model_1.default.find({
        _id: { $in: paginatedWishlist },
    })
        .populate('createdBy')
        .populate('category');
    // Calculate pagination metadata
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    // Send the response with the paginated wishlist
    res.status(200).json({
        status: 'success',
        success: true,
        data: {
            data: populatedWishlist, // Paginated and populated wishlist
            pagination, // Pagination metadata
        },
        message: 'Wishlist fetched successfully!',
    });
}));
exports.clearWishlist = (0, asyncHandler_util_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId).populate('wishList');
    if (!user) {
        throw new errorhandler_middleware_1.default('User not found', 404);
    }
    user.wishlist = [];
    yield user.save();
    res.status(200).json({
        status: 'success',
        success: true,
        data: user.wishlist,
        message: 'Wishlist cleared successfully!'
    });
}));
