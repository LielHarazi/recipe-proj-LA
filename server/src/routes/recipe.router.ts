import express from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.mid";
import {
  validateCreateInput,
  validateRecipeAndOwner,
  validatEditInput,
} from "../middleware/validation";
import recipeController from "../controllers/recipe.controller";

const router = express.Router();

router.get("/", recipeController.getAll);
router.get("/:id", recipeController.getbyId);
router.get("/full", recipeController.getFull);
router.post(
  "/",
  authenticateToken,
  validateCreateInput,
  recipeController.create
);
router.delete(
  "/:id",
  validateRecipeAndOwner,
  authenticateToken,
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
