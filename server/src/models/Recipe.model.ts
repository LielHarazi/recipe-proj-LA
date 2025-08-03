import mongoose, { Schema } from "mongoose";
import { IRecipe } from "../types";
import Review from "./Reviews.model";

const recipeSchema = new Schema<IRecipe>(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: String,
    ingredients: [String],
    instructions: [String],
    tags: [String],
    cookingTime: Number,
  },
  {
    timestamps: true,
  }
);
recipeSchema.pre("save", function (this: IRecipe, next) {
  console.log(`[PRE-SAVE] Document about to be saved: ${this._id}`);
  next();
});
recipeSchema.pre(/delete/i, async function (this: any, next) {
  const docId = this.getQuery()._id;
  if (!docId) {
    console.log("No ID found in delete query.");
    return next();
  }
  const recipe = await mongoose
    .model("Recipes")
    .findById(docId)
    .select("title");
  if (recipe) {
    console.log(`Deleting recipe "${recipe.title}" and its reviews...`);
  }
  await Review.deleteMany({ recipe: docId });
  next();
});

const Recipe = mongoose.model<IRecipe>("Recipes", recipeSchema);
export default Recipe;
