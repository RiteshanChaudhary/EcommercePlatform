import express from "express";
import { create, getAll, getById, remove, update } from "../controllers/product.controller";
import multer from "multer";
import { Authenticate } from "../middlewares/authentication.middleware";
import { onlyAdmin } from "../@types/global.types";

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + file.originalname);
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

router.put('/:id',Authenticate(onlyAdmin),
upload.fields([
	{
		name: "coverImage",
		maxCount: 1,
	},
	{
		name: "images",
		maxCount: 6,
	},
]),update)

//delete product 
router.delete('/:id',Authenticate(onlyAdmin),remove)

router.get("/", getAll);
router.get("/:id", getById);

export default router;
