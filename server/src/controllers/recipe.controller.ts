import { Request, Response } from "express";
import RecipeModel from "../models/Recipe.model";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.mid";
const recipeController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await RecipeModel.find({});
      const populatedRecipes = await RecipeModel.find({}).populate(
        "addedBy",
        "name"
      );

      if (!recipes.length) {
        res.status(404).json({
          success: false,
          message: `No recipes found, add some...`,
        });
        return;
      }
      res.json({
        success: true,
        data: populatedRecipes,
      });
    } catch (error) {
      console.error("get all recipes error:", error);
      res
        .status(500)
        .json({ message: "Server error during fetching recipes", error });
    }
  },
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, ingredients, instructions } = req.body;
      const user = await User.findById(req.user?.userId);
      if (!user) {
        res.status(400).json({
          success: false,
          message: "error user is not found",
        });
        return;
      }
      const newRecipe = await RecipeModel.create({
        title,
        ingredients,
        instructions,
        addedBy: user._id,
      });
      const populatedRecipe = await RecipeModel.findById(
        newRecipe._id
      ).populate("addedBy", "name");
      res.status(201).json({
        success: true,
        data: populatedRecipe,
      });
    } catch (error) {
      console.error("creating recipe error:", error);
      res
        .status(500)
        .json({ message: "Server error during creating recipe", error });
    }
  },
  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      //   console.log("hi");

      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      await RecipeModel.findOneAndDelete({ _id: id });

      res.json({
        success: true,
        message: `Recipe with id: ${id} Delete, R.I.P`,
      });
    } catch (error) {
      console.error("Deleting error:", error);
      res.status(500).json({ message: "Server error during Delete", error });
    }
  },
  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, ingredients, instructions } = req.body;
      const { id } = req.params;

      const upadtedRecipe = await RecipeModel.findByIdAndUpdate(
        id,
        { title, ingredients, instructions },
        { new: true }
      );
      if (!upadtedRecipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }
      res.json({ success: true, data: upadtedRecipe });
    } catch (error) {
      console.error("editting error:", error);
      res
        .status(500)
        .json({ message: "Server error during recipe editting", error });
    }
  },
};
export default recipeController;
