import express from "express";
import { authenticateToken } from "../middleware/auth.mid";
import {
  validateReviewCreateInput,
  validateReviewUpdate,
} from "../middleware/validation";
import reviewsController from "../controllers/reviews.controller";

const router = express.Router();

//revews routes
router.get("/:recipeID", reviewsController.getAll);
router.get("/review/:reviewID", authenticateToken, reviewsController.getById);
router.post(
  "/:recipeID",
  authenticateToken,
  validateReviewCreateInput,
  reviewsController.create
);
router.patch(
  "/review/:reviewID",
  authenticateToken,
  validateReviewUpdate,
  reviewsController.update
);
router.delete("/review/:reviewID", authenticateToken, reviewsController.remove);

export default router;
