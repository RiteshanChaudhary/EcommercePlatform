import express, { Router } from "express";
import { create, getAll, getReviewByProductId, remove, update } from "../controllers/review.controller";
import { Authenticate } from "../middlewares/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";

const router: Router = express.Router();

// create review
router.post("/", Authenticate(onlyUser), create);

// get all reviews
router.get("/", Authenticate(onlyAdmin), getAll);

// update review by id
router.put('/:id',Authenticate(onlyUser), update)

// get user review by product id
router.get('/:id',Authenticate(onlyAdmin), getReviewByProductId)

// delete review by id 
router.delete('/:id',remove)

export default router;
