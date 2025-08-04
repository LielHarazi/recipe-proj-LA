import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.mid";
import RecipeModel from "../models/Recipe.model";
import ReviewModel from "../models/Reviews.model";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  return { isValid: true };
};

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, name } = req.body;

  // Check required fields
  if (!email || !password || !name) {
    res
      .status(400)
      .json({ message: "All fields (email, password, name) are required" });
    return;
  }

  // Validate email format
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please provide a valid email address" });
    return;
  }

  // Validate name length
  if (name.trim().length < 2) {
    res
      .status(400)
      .json({ message: "Name must be at least 2 characters long" });
    return;
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    res.status(400).json({ message: passwordValidation.message });
    return;
  }

  next();
};

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  // Validate email format
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please provide a valid email address" });
    return;
  }

  next();
};

export const validateCreateInput = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const {
    title,
    ingredients,
    instructions,
    tags,
    cookingTime,
    description,
    difficulty,
    servings,
  } = req.body;

  // Check required fields
  if (
    !title ||
    !ingredients ||
    !instructions ||
    !tags ||
    !cookingTime ||
    !description ||
    !difficulty ||
    !servings
  ) {
    res.status(400).json({ message: "missing fields for recipe" });
    return;
  }
  if (
    !Array.isArray(ingredients) ||
    !Array.isArray(instructions) ||
    !Array.isArray(tags)
  ) {
    res
      .status(400)
      .json({ message: "ingredients and instructions must be an array!" });
    return;
  }
  if (title.length < 2) {
    res.status(400).json({ message: "title must be at least tow characters!" });
    return;
  }
  if (difficulty.length < 2) {
    res
      .status(400)
      .json({ message: "difficulty must be at least tow characters!" });
    return;
  }
  if (description.length < 2) {
    res
      .status(400)
      .json({ message: "description must be at least tow characters!" });
    return;
  }
  if (ingredients.length < 2) {
    res.status(400).json({ message: "must have at least two ingredients!" });
    return;
  }
  if (!tags.length) {
    res.status(400).json({ message: "must have at least one tag!" });
    return;
  }
  if (!instructions.length) {
    res.status(400).json({ message: "must have at least one instructions!" });
    return;
  }
  if (isNaN(Number(cookingTime))) {
    res.status(400).json({ message: "cooking time must be a number" });
    return;
  }
  if (isNaN(Number(servings))) {
    res.status(400).json({ message: "servings time must be a number" });
    return;
  }

  next();
};
export const validatEditInput = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const {
    title,
    ingredients,
    instructions,
    tags,
    cookingTime,
    description,
    difficulty,
    servings,
  } = req.body;

  // Check required fields
  if (
    !title &&
    !ingredients &&
    !instructions &&
    !tags &&
    !cookingTime &&
    !description &&
    !difficulty &&
    !servings
  ) {
    res.status(400).json({ message: "At leat one field is required" });
    return;
  }
  if (
    (!Array.isArray(ingredients) && ingredients) ||
    (instructions && !Array.isArray(instructions))
  ) {
    res
      .status(400)
      .json({ message: "ingredients and instructions must be an array!" });
    return;
  }
  if (title && title.length < 2) {
    res.status(400).json({ message: "title must be at least tow characters!" });
    return;
  }
  if (difficulty && difficulty.length < 2) {
    res
      .status(400)
      .json({ message: "difficulty must be at least tow characters!" });
    return;
  }
  if (description && description.length < 2) {
    res
      .status(400)
      .json({ message: "description must be at least tow characters!" });
    return;
  }
  if (ingredients && ingredients.length < 2) {
    res.status(400).json({ message: "must have at least two ingredients!" });
    return;
  }
  if (tags && !tags.length) {
    res.status(400).json({ message: "must have at least one tag!" });
    return;
  }
  if (instructions && !instructions.length) {
    res.status(400).json({ message: "must have at least one instructions!" });
    return;
  }
  if (cookingTime && isNaN(Number(cookingTime))) {
    res.status(400).json({ message: "cooking time must be a number" });
    return;
  }
  if (servings && isNaN(Number(servings))) {
    res.status(400).json({ message: "servings time must be a number" });
    return;
  }

  next();
};

export const validateRecipeAndOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    // console.log("-----------------------------");
    // console.log(recipe);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: `Recipe With id: ${id} Not Found`,
      });
      return;
    }

    if (req.user?.userId == recipe.addedBy) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "You are not authorized to effect a recipe you havent craeted",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during recipe ownership validation",
      error,
    });
  }
};
export const validateReviewCreateInput = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const { rating, comment } = req.body;

  // Check required fields
  if (!rating || !comment) {
    res.status(400).json({ message: "missing fields for review" });
    return;
  }

  if (comment.length < 5) {
    res.status(400).json({ message: "comment must be at least 5 characters!" });
    return;
  }
  if (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5) {
    res.status(400).json({ message: "rating must be a number between 1-5" });
    return;
  }

  next();
};
export const validateReviewUpdate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { rating, comment } = req.body;

  // Check required fields
  if (!rating && !comment) {
    res.status(400).json({ message: "at least one field is needed" });
    return;
  }

  if (comment && comment.length < 5) {
    res.status(400).json({ message: "comment must be at least 5 characters!" });
    return;
  }
  if (
    rating &&
    (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)
  ) {
    res.status(400).json({ message: "rating must be a number between 1-5" });
    return;
  }
  const { reviewID } = req.params;
  if (!reviewID) {
    res.status(404).json({ message: "review not found" });
    return;
  }
  try {
    const review = await ReviewModel.findById(reviewID);
    if (!reviewID) {
      res.status(404).json({ message: "review not found" });
      return;
    }
    if (String(req.user?.userId) !== String(review?.reviewer._id)) {
      res.status(401).json({ message: "you cannot edit other person review!" });
      return;
    }
  } catch (error) {
    console.error("validating reviewer error:", error);
    res
      .status(500)
      .json({ message: "Server error during validating reviewer", error });
  }
  next();
};
