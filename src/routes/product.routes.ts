import express from "express";
import {
	create,
	getAll,
	getById,
	update,
	remove,
} from "../controllers/product.controller";
import multer from "multer";
import { Authenticate } from "../middlewares/authentication.middleware";
import { onlyAdmin } from "../@types/global.types";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.config";

const router = express.Router();

const storage =  new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
	  
	  return {
		folder: 'ecom/products',
		allowed_formats: ['jpeg','webp','jpg','png','svg'],
	  };
	},
  });

const upload = multer({ storage: storage });

// create product
router.post(
	"/",
	Authenticate(onlyAdmin),
	upload.fields([
		{
			name: "coverImage",
			maxCount: 1,
		},
		{
			name: "images",
			maxCount: 6,
		},
	]),
	create
);

router.put(
	"/:id",
	Authenticate(onlyAdmin),
	upload.fields([
		{
			name: "coverImage",
			maxCount: 1,
		},
		{
			name: "images",
			maxCount: 6,
		},
	]),

	update
);

// delete product
router.delete("/:id", Authenticate(onlyAdmin), remove);

router.get("/", getAll);
router.get("/:id", getById);

export default router;