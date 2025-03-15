import express from "express";
import {
	register,
	update,
	login,
	getAll,
} from "../controllers/user.controller";
import { Authenticate } from "../middlewares/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";

const router = express.Router();

// register user
router.post("/", register);

// get all users
router.get("/", Authenticate(onlyAdmin), getAll);

// update user profile
router.put("/:id", Authenticate(onlyUser), update);

// login
router.post("/login", login);

export default router;
