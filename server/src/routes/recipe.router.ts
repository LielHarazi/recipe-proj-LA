import express from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.mid";
import {
  validateRegisterInput,
  validateLoginInput,
  validateCreateInput,
  validateRecipeAndOwner,
  validatEditInput,
} from "../middleware/validation";
import recipeController from "../controllers/recipe.controller";

const router = express.Router();

router.get("/", recipeController.getAll);
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
// // Authentication routes
// router.post("/register", validateRegisterInput, AuthController.register);-
// router.post("/login", validateLoginInput, AuthController.login);
// router.post("/logout", AuthController.logout);

// // Protected routes
// router.get("/me", authenticateToken, AuthController.getMe);

// // Admin/Development routes (protected)
// router.get("/users", authenticateToken, AuthController.getAllUsers);
// router.delete("/users/:id", authenticateToken, AuthController.deleteUser);

export default router;
