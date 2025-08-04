import { Request, Response } from "express";
import RecipeModel from "../models/Recipe.model";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.mid";
import mongoose from "mongoose";
import DiscordHandler from "../discord/discird.handler";
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
  async getFull(req: Request, res: Response): Promise<void> {
    try {
      const recipesWithReviews = await RecipeModel.aggregate([
        {
          $lookup: {
            from: "reviews", // reviews collection
            localField: "_id", // Recipe._id
            foreignField: "recipe", // Review.recipe
            as: "reviews",
          },
        },
        {
          $unwind: {
            path: "$reviews",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reviews.user",
            foreignField: "_id",
            as: "reviews.user",
          },
        },
        {
          $unwind: {
            path: "$reviews.user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            addedBy: { $first: "$addedBy" },
            ingredients: { $first: "$ingredients" },
            instructions: { $first: "$instructions" },
            tags: { $first: "$tags" },
            cookingTime: { $first: "$cookingTime" },
            description: { $first: "$description" },
            difficulty: { $first: "$difficulty" },
            servings: { $first: "$servings" },
            reviews: {
              $push: {
                _id: "$reviews._id",
                rating: "$reviews.rating",
                comment: "$reviews.comment",
                createdAt: "$reviews.createdAt",
                user: {
                  _id: "$reviews.user._id",
                  name: "$reviews.user.name",
                },
              },
            },
            reviewsCount: {
              $sum: { $cond: [{ $ifNull: ["$reviews._id", false] }, 1, 0] },
            },
            averageRatingRaw: { $avg: "$reviews.rating" }, // out of 5
          },
        },
        {
          $addFields: {
            averageRating: { $multiply: ["$averageRatingRaw", 2] }, // out of 10
          },
        },
      ]);
      if (!recipesWithReviews.length) {
        res.status(404).json({
          success: false,
          message: `No recipes found, add some...`,
        });
        return;
      }
      res.json({
        success: true,
        data: recipesWithReviews,
      });
    } catch (error) {
      console.error("get full recipes error:", error);
      res
        .status(500)
        .json({ message: "Server error during fetching full recipes", error });
    }
  },
  async getbyId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(404).json({ message: "recipe not found" });
        return;
      }
      const recipe = await RecipeModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "recipe",
            as: "reviews",
          },
        },
        {
          $unwind: {
            path: "$reviews",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reviews.user",
            foreignField: "_id",
            as: "reviews.user",
          },
        },
        {
          $unwind: {
            path: "$reviews.user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            addedBy: { $first: "$addedBy" },
            ingredients: { $first: "$ingredients" },
            instructions: { $first: "$instructions" },
            tags: { $first: "$tags" },
            cookingTime: { $first: "$cookingTime" },
            description: { $first: "$description" },
            difficulty: { $first: "$difficulty" },
            servings: { $first: "$servings" },
            reviews: {
              $push: {
                _id: "$reviews._id",
                rating: "$reviews.rating",
                comment: "$reviews.comment",
                createdAt: "$reviews.createdAt",
                user: {
                  _id: "$reviews.user._id",
                  name: "$reviews.user.name",
                },
              },
            },
            reviewsCount: {
              $sum: { $cond: [{ $ifNull: ["$reviews._id", false] }, 1, 0] },
            },
            averageRatingRaw: { $avg: "$reviews.rating" },
          },
        },
        {
          $addFields: {
            averageRating: { $multiply: ["$averageRatingRaw", 2] }, // out of 10
          },
        },
        {
          $project: {
            averageRatingRaw: 0,
          },
        },
      ]);
      if (!recipe) {
        res.status(404).json({
          success: false,
          message: ` recipe not found, add some...`,
        });
        return;
      }
      res.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      console.error("get full recipes error:", error);
      res
        .status(500)
        .json({ message: "Server error during fetching full recipes", error });
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
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
        tags,
        description,
        difficulty,
        servings,
        cookingTime,
        addedBy: user._id,
      });
      const populatedRecipe = await RecipeModel.findById(
        newRecipe._id
      ).populate("addedBy", "name");
      DiscordHandler.recipeToDiscord("new", newRecipe.title, user.name);
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

      const deletedRecipe = await RecipeModel.findOneAndDelete({
        _id: id,
      }).populate("addedBy", "name");
      if (!deletedRecipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      if (
        typeof deletedRecipe.addedBy === "object" &&
        "name" in deletedRecipe.addedBy &&
        typeof deletedRecipe.addedBy.name === "string"
      ) {
        console.log(deletedRecipe.addedBy.name);
        DiscordHandler.recipeToDiscord(
          "delete",
          deletedRecipe.title,
          deletedRecipe.addedBy.name
        );
      }

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
      const { id } = req.params;

      const upadtedRecipe = await RecipeModel.findByIdAndUpdate(
        id,
        {
          title,
          ingredients,
          instructions,
          tags,
          cookingTime,
          description,
          difficulty,
          servings,
        },
        { new: true }
      ).populate("addedBy", "name");
      if (!upadtedRecipe) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${id} Not Found`,
        });
        return;
      }

      console.log(upadtedRecipe);
      if (
        typeof upadtedRecipe.addedBy === "object" &&
        "name" in upadtedRecipe.addedBy &&
        typeof upadtedRecipe.addedBy.name === "string"
      ) {
        console.log(upadtedRecipe.addedBy);
        console.log(upadtedRecipe.addedBy.name);
        DiscordHandler.recipeToDiscord(
          "update",
          upadtedRecipe.title,
          upadtedRecipe.addedBy.name
        );
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
