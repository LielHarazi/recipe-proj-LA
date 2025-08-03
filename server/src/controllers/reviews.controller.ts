import { Request, Response } from "express";
import RecipeModel from "../models/Recipe.model";
import { AuthRequest } from "../middleware/auth.mid";
import ReviewModel from "../models/Reviews.model";
import User from "../models/User";
const reviewsController = {
  async getAll(req: Request, res: Response) {
    const { recipeID } = req.params;

    try {
      const recipe = await RecipeModel.findById(recipeID);
      // console.log(recipe);

      if (!recipe) {
        return res.status(404).json({ message: "recipe not found" });
      }
      const reviews = await ReviewModel.find({ recipe: recipeID })
        .populate("recipe", "title")
        .populate("reviewer", "name");
      if (!reviews.length) {
        res.status(404).json({
          success: false,
          message: `No reviews found, add some...`,
        });
        return;
      }
      return res.status(200).json({ message: "reviews found", reviews });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Somthing went wrong couldnt load reviews" });
    }
  },
  async getById(req: AuthRequest, res: Response) {
    const { reviewID } = req.params;
    if (!reviewID) {
      return res.status(404).json({ message: "review not found" });
    }

    try {
      const review = await ReviewModel.findById(reviewID).populate([
        { path: "reviewer", select: "name" },
        { path: "recipe", select: "title" },
      ]);
      if (!review) {
        res.status(400).json({
          success: false,
          message: `Review With id: ${reviewID} Not Found`,
        });
        return;
      }
      return res.status(200).json({ message: "review found", review });
    } catch (error) {
      console.error("review error:", error);
      res.status(500).json({ message: "review error" });
    }
  },
  async create(req: AuthRequest, res: Response) {
    const { rating, comment } = req.body;
    const { recipeID } = req.params;

    try {
      const user = await User.findById(req.user!.userId);
      const recipe = await RecipeModel.findById(recipeID);

      if (!rating || !comment) {
        return res.status(400).json({ message: "Missing fields" });
      }
      if (!user) {
        return res.status(401).json({ message: "You must Be logged in" });
      }
      if (!recipe) {
        return res.status(400).json({ message: "no recipe was found" });
      }
      if (String(user._id) === String(recipe.addedBy._id)) {
        return res
          .status(403)
          .json({ message: "you cannot review your own recipe be honest!" });
      }
      const existingReview = await ReviewModel.findOne({
        recipe: recipe._id,
        reviewer: user._id,
      });

      if (existingReview) {
        return res.status(409).json({
          message: "You have already reviewed this recipe.",
        });
      }

      const newRating = await ReviewModel.create({
        rating: Number(rating),
        comment,
        reviewer: user._id,
        recipe: recipe._id,
      });

      const populatedRating = await newRating.populate([
        { path: "recipe", select: "title" },
        { path: "reviewer", select: "name" },
      ]);

      res
        .status(201)
        .json({ message: "review created successfully", populatedRating });
    } catch (error) {
      console.error("creating review error:", error);
      res
        .status(500)
        .json({ message: "Server error during creating review", error });
    }
  },
  async update(req: AuthRequest, res: Response) {
    try {
      const { rating, comment } = req.body;
      const { reviewID } = req.params;

      const upadtedReview = await ReviewModel.findByIdAndUpdate(
        reviewID,
        { rating: Number(rating), comment },
        { new: true }
      );
      if (!upadtedReview) {
        res.status(404).json({
          success: false,
          message: `Recipe With id: ${reviewID} Not Found`,
        });
        return;
      }
      res.json({ success: true, data: upadtedReview });
    } catch (error) {
      console.error("editting review error:", error);
      res
        .status(500)
        .json({ message: "Server error during editting review", error });
    }
  },
  async remove(req: AuthRequest, res: Response) {
    try {
      const { reviewID } = req.params;
      if (!reviewID) {
        res.status(404).json({
          success: false,
          message: `Review With id: ${reviewID} Not Found`,
        });
        return;
      }
      const removed = await ReviewModel.findByIdAndDelete(reviewID);
      if (!removed) {
        res.status(400).json({
          success: false,
          message: `Review With id: ${reviewID} Not Found`,
        });
        return;
      }
      res.json({
        success: true,
        message: `Review With id: ${reviewID} Deleted, R.I.P`,
      });
    } catch (error) {
      console.error(" error deleting review:", error);
      res
        .status(500)
        .json({ message: "Server error during deleting review", error });
    }
  },
};
// async function update(req: AuthRequest, res: Response) {
//   const user = await UserModel.findById(req.user!.userId);
//   const { postId } = req.params;

//   if (!postId) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   if (!user) {
//     return res.status(401).json({ message: "You must Be logged in" });
//   }

//   const { title, content } = req.body ?? {};

//   if (!title || !content) {
//     console.log("title", title);
//     console.log("content", content);
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     // const { username } = req.user;
//     const updatedPost = await postsModel.update(
//       postId,
//       { title, content },
//       user.id
//     );
//     // postsModel.postToDiscord("update", { title, content }, user.name);

//     return res
//       .status(200)
//       .json({ message: "Post updated successfully", updatedPost });
//   } catch (error) {
//     console.log(error);
//     if (error! instanceof Error) {
//       return res.status(500).json({ message: "unknown error" });
//     } else if (error instanceof Error) {
//       switch (error.name) {
//         case ERROR_NAMES.ERROR_POST_NOT_FOUND:
//           return res.status(404).json({ message: error.message });
//         case ERROR_NAMES.ERROR_USER_NOT_FOUND:
//           return res.status(401).json({ message: error.message });
//         case ERROR_NAMES.ERROR_UNAUTHORIZED:
//           return res.status(403).json({ message: error.message });
//         default:
//           return res.status(500).json({ message: "Something went wrong" });
//       }
//     }
//   }
// }
// async function remove(req: AuthRequest, res: Response) {
//   const user = await UserModel.findById(req.user!.userId);

//   const { postId } = req.params;

//   if (!postId) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   if (!user) {
//     return res.status(401).json({ message: "You must Be logged in" });
//   }

//   try {
//     const removedPost = await postsModel.remove(postId, user.id);
//     return res
//       .status(200)
//       .json({ message: "Post removed successfully", removedPost });
//   } catch (error) {
//     console.log(error);
//     if (error! instanceof Error) {
//       return res.status(500).json({ message: "unknown error" });
//     } else if (error instanceof Error) {
//       switch (error.name) {
//         case ERROR_NAMES.ERROR_POST_NOT_FOUND:
//           return res.status(404).json({ message: error.message });
//         case ERROR_NAMES.ERROR_USER_NOT_FOUND:
//           return res.status(401).json({ message: error.message });
//         case ERROR_NAMES.ERROR_UNAUTHORIZED:
//           return res.status(403).json({ message: error.message });
//         default:
//           return res.status(500).json({ message: "Something went wrong" });
//       }
//     }
//   }
// }

export default reviewsController;
