import express from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.mid";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validation";
import { postsController } from "../controllers/posts-controller";

const router = express.Router();

//posts routes
// router.get("/", authenticateToken, postsController.getAll);
router.get("/", postsController.getAll);
router.get("/:postId", authenticateToken, postsController.getById);
router.post("/", authenticateToken, postsController.create);
router.put("/:postId", authenticateToken, postsController.update);
router.delete("/:postId", authenticateToken, postsController.remove);

export default router;
