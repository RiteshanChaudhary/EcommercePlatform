import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import { Cart } from "../models/cart.model";
import  CustomError  from "../middlewares/errorhandler.middleware";
import Product from "../models/product.model";
import Order from "../models/order.model";
import { sendOrderConfirmationEmail } from "../utils/orderconfirmationEmail.util";



//place order 

export const placeOrder = asyncHandler(async(req: Request, res: Response) => {
    
    const userId = req.user._id;

    const cart = await Cart.findOne({user: userId}).populate('items.product');

    if(!cart) {
        throw new CustomError('Cart not found',404)
    }

    const products = await Promise.all(cart.items.map(async(item) => {

        const product = await Product.findById(item.product)

        if(!product) {
            throw new CustomError('Product not found', 404)
        }

            return {
            product: item.product._id,
            quantity: item.quantity,
            totalPrice: Number(product.price) * item.quantity
        }
    }))

    const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0)

    const order = new Order({
        user: userId,
        items: products,
        totalAmount
    });

    const newOrder = await order.save()

    const populatedOrder = await Order.findById(newOrder._id).populate('items.product')

    if(!populatedOrder) {
        throw new CustomError('Order not created',400)
    }


    await sendOrderConfirmationEmail({
        to: req.user.email,
        orderDetails: populatedOrder
    });

    await Cart.findByIdAndDelete(cart._id)

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order placed successfully!',
        data: populatedOrder
    })
})


//get all orders

export const getAllOrder = asyncHandler(async(req: Request, res:Response) => {

    const allOrders = await Order.find()
    . populate('items.product')
    .populate('user','-password');

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order fetched successfully!',
        data: allOrders
    });
});


//get orders by user id

export const getByUserId = asyncHandler(async(req: Request, res: Response) => {
    
    const userId = req.user._id

    const orders = Order.findOne({user:userId})
    .populate("items.product")
    .populate("user", "-password")

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order fetched successfully!',
        data: orders
    });
});


//update 

export const updateOrderStatus = asyncHandler(async(req:Request, res:Response) => {

    const orderId = req.params.id;

    const {status} = req.body;

    if(!status) {
        throw new CustomError('status is required', 404)
    }

    if(!orderId) {
        throw new CustomError('orderId is required', 400)
    }

    const updatedOrder = Order.findByIdAndUpdate(orderId,
         {status}, 
         {new: true})

    if(!updatedOrder) {
        throw new CustomError('order not found', 404)
    }

    res.status(201).json({
        success:true,
        status: 'success',
        message: 'order status updated successfully',
        data: updatedOrder,
    })
})


//delete order 

export const deleteOrder = asyncHandler(async(req:Request, res:Response) => {

    const orderId = req.params.id;

    if(!orderId) {
        throw new CustomError('orderId is required', 400)
    }

    const deletedOrder = Order.findByIdAndDelete(orderId)

    if(!deletedOrder) {
        throw new CustomError('order not found', 404)
    }

    res.status(201).json({
        success:true,
        status: 'success',
        message: 'order deleted successfully',
        data: deletedOrder,
    })
})


// cancel Order
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {

    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new CustomError('Order not found', 404);
    }

    if (order.user.toString() !== userId.toString()) {
        throw new CustomError('Unauthorized access to this order', 403);
    }

    if (['delivered', 'shipped', 'cancelled'].includes(order.status)) {
        throw new CustomError(`Order cannot be canceled when in ${order.status} status`, 400);
    }

    // Cancel the entire order
    order.status = 'cancelled';
    order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Order cancelled successfully!',
        data: order
})
})