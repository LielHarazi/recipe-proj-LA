import express from "express";
import { authenticateToken } from "../middleware/auth.mid";
import {
  validateCreateInput,
  validateRecipeAndOwner,
  validatEditInput,
} from "../middleware/validation";
import recipeController from "../controllers/recipe.controller";

const router = express.Router();

router.get("/", recipeController.getAll);
router.get("/full", recipeController.getFull);
router.get("/:id", recipeController.getbyId);
router.post(
  "/",
  authenticateToken,
  validateCreateInput,
  recipeController.create
);
router.delete(
  "/:id",
  authenticateToken,
  validateRecipeAndOwner,
  recipeController.remove
);
router.patch(
  "/:id",
  authenticateToken,
  validateRecipeAndOwner,
  validatEditInput,
  recipeController.update
);

export default router;
