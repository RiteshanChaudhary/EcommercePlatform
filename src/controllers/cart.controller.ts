import { Request, Response } from "express";
import CustomError from "../middlewares/errorhandler.middleware";
import Product from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler.util";
import { Cart } from "../models/cart.model";


 



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
    const userId = req.params.userId;

    const cart = await Cart.findOne({user:userId}).populate('user','-password')
    .populate('items.product')

    res.status(200).json({
        status:'success',
        success:true,
        message:'cart fetched successfully',
        data:cart
    })
})


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