import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
		},
		price: {
			type: Number,
			required: [true, "price is required"],
			min: [0, "price should be greater than 0"],
		},

		description: {
			type: String,
			required: false,
			min: [50, "description should be at least 50 character long"],
			trim: true,
		},
		coverImage: {
			public_id:{
				type: String,
				required: true,
			},
			path:{
				type: String,
				required: true,
			},
		
		},
		images: [
			{
				public_id:{
					type: String,
					required: true,
				},
				path:{
					type: String,
					required: true,
				}
			},
		],
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "user",
			required: [true, "Author is required"],
		},
		category: {
			type: mongoose.Types.ObjectId,
			ref: "category",
			required: [true, "Category is required"],
		},
		reviews: [
			{
				type: mongoose.Types.ObjectId,
				ref: "review",
				required: false,
			},
		],
		averageRating: {
			type: Number,
			default: 0,
		},
		wishLists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "product",
				required: true,
			},
		],
	},
	{ timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;