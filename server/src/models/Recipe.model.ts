import mongoose, { Schema } from "mongoose";
import { IRecipe } from "../types";

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
  },
  {
    timestamps: true,
  }
);
recipeSchema.pre("save", function (this: IRecipe, next) {
  console.log(`[PRE-SAVE] Document about to be saved: ${this._id}`);
  next();
});

const Recipe = mongoose.model<IRecipe>("Recipes", recipeSchema);
export default Recipe;
