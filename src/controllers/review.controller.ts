import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import Review from "../models/review.model";
import Product from "../models/product.model";
import CustomError from "../middlewares/errorhandler.middleware";
import { getPaginationData } from "../utils/pagination.utils";

export const create = asyncHandler(async (req: Request, res: Response) => {

  const body = req.body;
  const user = req.user

  const { productId, rating } = body;
  
  if (!productId) {
    throw new CustomError("userId and productId is required", 400);
  }
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  const newReview = await Review.create({
    ...body,
    product: productId,
    user: user._id,
  });

  product.reviews.push(newReview._id);

  console.log(product?.averageRating, rating);

  const totalRating: number =
    (product?.averageRating as number) * (product.reviews.length - 1) +
    Number(rating);

  product.averageRating = totalRating / product.reviews.length;

  await product.save();

  res.status(201).json({
    status: "success",
    success: true,
    data: newReview,
    message: "Review created successfully!",
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {

  const { limit, page, query, rating,product} = req.query
  const queryLimit = parseInt(limit as string) || 10;
  const currentPage = parseInt(page as string) || 1;
  const skip = (currentPage - 1) * queryLimit;
  let filter: Record<string, any> = {};
  if(rating){
    filter.rating = parseInt(rating as string)
  }

  if(product) {
    filter.product = product
  }

  if (query) {
    filter.$or = [
      {
        review: { $regex: query, $options: "i" },
      },
    ];
  }
  const reviews = await Review.find(filter)
  .skip(skip)
  .limit(queryLimit)
  .sort({createdAt:-1})
  .populate("product")
  .populate("user");

  const totalCount = await Review.countDocuments(filter);

  const pagination = getPaginationData(currentPage, queryLimit, totalCount);
  res.status(200).json({
    success: true,
    status: "success",
    data: {
      data:reviews,
      pagination
    },
    message: "Reviews fetched successfully!",
  });
});

// update

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { rating, review } = req.body;
  if (typeof rating !== "number") {
    throw new CustomError("Review must be a number type", 400);
  }
  const id = req.params.Identifier;
  const oldReview = await Review.findById(id);
  if (!oldReview) {
    throw new CustomError("Review not found", 404);
  }
  const product = await Product.findById(review.product);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  const newRating =
    Number(product.averageRating) * product.reviews.length -
    oldReview.rating +
    Number(rating);

  product.averageRating = newRating / product.reviews.length;
  await product.save();

  const newReview = await Review.findByIdAndUpdate(
    id,
    { rating, review },
    { new: true }
  );

  res.status(200).json({
    success: true,
    status: "success",
    data: newReview,
    message: "Review updated successfully!",
  });
});

// delete

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  const product = await Product.findById(review.product);
  product.reviews.pull(review._id);

  if (product.reviews.length === 0) {
    product.averageRating = 0;
  } else {
    product.averageRating =
      (Number(product.averageRating) * (product.reviews.length + 1) -
        review.rating) /
      product.reviews.length;
  }

  await Review.findByIdAndDelete(review._id);
  await product.save();

  res.status(200).json({
    success: true,
    status: "success",
    data: review,
    message: "Review deleted successfully",
  });
});

// get reviews by product id

export const getReviewByProductId = asyncHandler(
    async (req:Request,res:Response) => {
        const productId = req.params.id
        const reviews = await Review.find({product:productId}).populate("user");

        res.status(200).json({
            success:true,
            status:"success",
            data:reviews,
            message:"Review fetched successfully"
        })

    }

)
