import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import Product from "../models/product.model";
import CustomError from "../middlewares/errorhandler.middleware";
import { deleteFiles } from "../utils/deleteFiles.util";
import Category from "../models/category.model";
import { getPaginationData } from "../utils/pagination.utils";

export const create = asyncHandler(async (req: Request, res: Response) => {
	const { name, price, description, category: categoryId } = req.body;
	const admin = req.user;
	const files = req.files as {
		coverImage?: Express.Multer.File[];
		images?: Express.Multer.File[];
	};
	if (!files || !files.coverImage) {
		throw new CustomError("Cover image is required", 400);
	}
	const coverImage = files.coverImage;
	const images = files.images;

	// get category
	const category = await Category.findById(categoryId);

	if (!category) {
		throw new CustomError("Category not found", 404);
	}

	const product = new Product({
		name,
		price,
		description,
		createdBy: admin._id,
		category: category._id,
	});

	product.coverImage = {
		path:coverImage[0]?.path,
		public_id:coverImage[0]?.fieldname
	};

	if (images && images.length > 0) {
		const imagePath = images.map(
			(image: any, index: number) =>{
				return {
					path:image.path,
					public_id:image.fieldname
				}
			}
		);
		product.images = imagePath;
	}

	await product.save();

	res.status(201).json({
		status: "success",
		success: true,
		data: product,
		message: "Product created successfully!",
	});
});

// update product

export const update = asyncHandler(async (req: Request, res: Response) => {
	const { deletedImages, name, description, price, categoryId } = req.body;
	const id = req.params.id;
	const { coverImage, images } = req.files as {
		[fieldname: string]: Express.Multer.File[];
	};

	const product = await Product.findByIdAndUpdate(
		id,
		{ name, description, price },
		{ new: true }
	);

	if (!product) {
		throw new CustomError("Product not found", 404);
	}

	if (categoryId) {
		const category = await Category.findById(categoryId);
		if (!category) {
			throw new CustomError("Category not found", 404);
		}

		product.category = categoryId;
	}

	if (coverImage) {
		await deleteFiles([product.coverImage as string]);
		product.coverImage = {
			path:coverImage[0].path,
			public_id:coverImage[0].fieldname
		};
	}

	if (deletedImages && deletedImages.length > 0) {
		await deleteFiles(deletedImages as string[]);
		product.images = product.images.filter(
			(image) => !deletedImages.includes(image.public_id)
		);
	}

	if (images && images.length > 0) {
		const imagePath = images.map(
			(image: any, index: number) => {
				return {
					path:image.path,
					public_id:image.fieldname
				}
			}
		);
		product.images = [...product.images, ...imagePath];
	}

	await product.save();

	res.status(201).json({
		status: "success",
		success: true,
		data: product,
		message: "Product updated successfully!",
	});
});

// delete product

export const remove = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.id;

	const product = await Product.findById(id);

	if (!product) {
		throw new CustomError("Product not found", 404);
	}

	if (product.coverImage) {
		await deleteFiles([product.coverImage.public_id] as string[]);

	}

	if (product.images && product.images.length > 0) {
		await deleteFiles(product.images.map(image => image.public_id) as string[]);
	}

	await Product.findByIdAndDelete(product._id);

	res.status(201).json({
		status: "success",
		success: true,
		data: product,
		message: "Product deleted successfully!",
	});
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
	const {
		limit,
		page,
		query,
		category,
		minPrice,
		maxPrice,
		sortBy = "createdAt",
		order = "DESC",
	} = req.query;
	const queryLimit = parseInt(limit as string) || 10;
	const currentPage = parseInt(page as string) || 1;
	const skip = (currentPage - 1) * queryLimit;
	let filter: Record<string, any> = {};

	if (category) {
		filter.category = category;
	}

	if (minPrice && maxPrice) {
		filter.price = {
			$lte: parseFloat(maxPrice as string),
			$gte: parseFloat(minPrice as string),
		};
	}

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

	const products = await Product.find(filter)
		.skip(skip)
		.limit(queryLimit)
		.populate("createdBy")
		.populate("category")
		.sort({ [sortBy as string]: order === "DESC" ? -1 : 1 });

	const totalCount = await Product.countDocuments(filter);

	const pagination = getPaginationData(currentPage, queryLimit, totalCount);

	res.status(200).json({
		success: true,
		status: "success",
		data: {
			data: products,
			pagination,
		},
		message: "Products fetched successfully!",
	});
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.id;
	const product = await Product.findById(id).populate("createdBy");

	res.status(200).json({
		success: true,
		status: "success",
		data: product,
		message: "Product fetched successfully!",
	});
});