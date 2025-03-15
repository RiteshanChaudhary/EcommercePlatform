import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.util';
import  CustomError  from '../middlewares/errorhandler.middleware';
import Product from '../models/product.model';
import User from '../models/user.model';


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


export const create = asyncHandler(async(req: Request, res:Response) => {

    const userId = req.user._id

    const {productId} = req.body

    const user = await User.findById(userId)

    if(!user) {
        throw new CustomError('User not found', 404)
    }

    const product = await Product.findById(productId)
    if(!product) {
        throw new CustomError('Product not found', 404)
    }
    
    const existingProduct = user.wishlist.find((list)=> list.toString() === productId)

    if(!existingProduct) {
        user.wishlist.push(productId)
    }

    await user.save()

    res.status(201).json({
        status: 'success',
        success: true,
        data:user.wishlist,
        message: 'Product added to wishlist successfully!'
    })

})


export const removeProductFromList = asyncHandler(async(req: Request, res:Response) => {
    const userId = req.user._id
    const productId = req.params.productId

    const user = await User.findById(userId)

    if(!user) {
        throw new CustomError('User not found', 404)
    }

    const existingProduct = user.wishlist.find((list)=> list.toString() === productId)

    if(!existingProduct) {
        throw new CustomError('Product does not exists in list', 404)
    }
    user.wishlist.filter((list)=> list.toString() !== productId)

    await user.save()
   
    res.status(200).json({
        status: 'success',
        success: true,
        data:user.wishlist,
        message: 'Product removed from wishlist successfully!'
    })
})


export const getUserWishlist = asyncHandler(async(req: Request, res:Response) => {

    const userId = req.user._id
    const user = await User.findById(userId).populate('wishList')

    if(!user) {
        throw new CustomError('User not found', 404)
    }

    res.status(200).json({
        status: 'success',
        success: true,
        data:user.wishlist,
        message: 'Wishlist fetched successfully!'
    })
})


export const clearWishlist = asyncHandler(async(req: Request, res:Response) => {
    const userId = req.user._id
    const user = await User.findById(userId).populate('wishList')

    if(!user) {
        throw new CustomError('User not found', 404)
    }

    user.wishlist = []
    await user.save()

    res.status(200).json({
        status: 'success',
        success: true,
        data:user.wishlist,
        message: 'Wishlist cleared successfully!'
    })
})
