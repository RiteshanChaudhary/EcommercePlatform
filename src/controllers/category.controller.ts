import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import Category from "../models/category.model";
import CustomError from "../middlewares/errorhandler.middleware";
import { getPaginationData } from "../utils/pagination.utils";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const category = await Category.create(body);

  res.status(201).json({
    status: "success",
    success: true,
    data: category,
    message: "Category created successfully!",
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {

  const { limit, page, query} = req.query
  const queryLimit = parseInt(limit as string) || 10;
  const currentPage = parseInt(page as string) || 1;
  const skip = (currentPage - 1) * queryLimit;
  let filter: Record<string, any> = {};

  if (query) {
    filter.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
      {
        description: { $regex: query, $options: "i" },
      },
    ];
  }
  const categories = await Category.find(filter)
  .skip(skip)
  .limit(queryLimit)
  .populate("createdBy");

  const totalCount = await Category.countDocuments(filter);

  const pagination = getPaginationData(currentPage, queryLimit, totalCount);

  res.status(200).json({
    success: true,
    status: "success",
    data: {
      data:categories,
      pagination
    },
    message: "Categories fetched successfully!",
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const id = req.params.id;
  if (!id) {
    throw new CustomError("id is required", 404);
  }
  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    status: "success",
    data: category,
    message: "Category updated successfully!",
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new CustomError("id is required", 404);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  await Category.findByIdAndDelete(category._id);

  res.status(200).json({
    success: true,
    status: "success",
    data: category,
    message: "Category deleted successfully!",
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new CustomError("id is required", 404);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    status: "success",
    data: category,
    message: "Category fetched successfully!",
  });
});
