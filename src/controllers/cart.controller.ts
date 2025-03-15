import { Request, Response } from "express";
import CustomError from "../middlewares/errorhandler.middleware";
import Product from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler.util";
import { Cart } from "../models/cart.model";
import { getPaginationData } from "../utils/pagination.utils";


 



export const create = asyncHandler(async(req:Request,res:Response)=> {
    const {userId,productId,quantity} = req.body
     let cart
    if(!userId) {
        throw new CustomError('userId is required',400)
    }

    if(!productId) {
        throw new CustomError('productId is required',400)
    }

     cart = await Cart.findOne({user: userId})

    if(!cart) {
         cart = new Cart({user:userId,items:[]})
    }

    const product = await Product.findById(productId)

    if(!product) {
        throw new CustomError('product not found',404)
    }

    const existingProduct = cart.items.find((item)=> item.product.toString()===productId)
    if(existingProduct) {
        existingProduct.quantity += Number(quantity)

        cart.items.push(existingProduct)
    } else {
        cart.items.push({product:productId,quantity})
    }

    

    await cart.save()

    res.status(201).json({
        status:'success',
        success:true,
        message: 'Product added to cart',
        data:cart
    })
})

export const getCartByUserId = asyncHandler(async(req:Request,res:Response)=> {
        // Extract pagination parameters from the query
        const { limit, page } = req.query;
    
        // Set default values for pagination
        const currentPage = parseInt(page as string) || 1;
        const queryLimit = parseInt(limit as string) || 10;
        const skip = (currentPage - 1) * queryLimit;
    
        // Get the user ID from the request parameters
        const userId = req.params.id;
    
        // Find the cart for the user
        const cart = await Cart.findOne({ user: userId })
            .populate('user', '-password') // Populate the user field (excluding password)
            .populate({
                path: 'items.product', // Populate the product field in the items array
                select: 'name price description', // Select specific fields from the Product model
            });
    
        // If the cart is not found, throw an error
        if (!cart) {
            throw new CustomError('Cart not found', 404);
        }
    
        // Get the total number of items in the cart
        const totalCount = cart.items.length;
    
        // Paginate the items array
        const paginatedItems = cart.items.slice(skip, skip + queryLimit);
    
        // Create a new cart object with paginated items
        const paginatedCart = {
            ...cart.toObject(), // Convert Mongoose document to a plain object
            items: paginatedItems, // Replace the items array with the paginated items
        };
    
        // Calculate pagination metadata
        const pagination = getPaginationData(currentPage, queryLimit, totalCount);
    
        // Send the response with the paginated cart
        res.status(200).json({
            status: 'success',
            success: true,
            message: 'Cart fetched successfully',
            data: {
                data: paginatedCart, // Paginated cart data
                pagination, // Pagination metadata
            },
        });
    });

export const clearCart = asyncHandler(async(req:Request,res:Response)=> {
    const userId = req.params.userId

    const cart = await Cart.findOne({user:userId})

    if(!cart) {
        throw new CustomError('Cart does not created yet.',400)
    }

    await Cart.findOneAndDelete({user:userId});

    res.status(200).json({
        status:'success',
        success:true,
        message:'Cart cleared successfully',
        data:null
    })

})


export const removeItemFromCart = asyncHandler(async(req:Request,res:Response)=> {
    const productId = req.params.productId;
    const userId = req.user._id
    if(!productId) {
        throw new CustomError('productId is required',400)
    }
    const cart = await Cart.findOne({user:userId})

    if(!cart) {
        throw new CustomError('Cart does not created yet.',400)
    }

    // cart.items = cart.items.filter((item)=>item.product.toString() !== productId)

    cart.items.pull({product:productId})
    
    const updatedCart = await cart.save()

    res.status(200).json({
        status:'success',
        success:true,
        message:'Cart updated successfully',
        data:updatedCart
    })

})