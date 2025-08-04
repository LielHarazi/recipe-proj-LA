import mongoose, { Schema } from "mongoose";
import { IReview } from "../types";

const reviewSchema = new Schema<IReview>(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipes",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);
reviewSchema.pre("save", function (this: IReview, next) {
  console.log(`[PRE-SAVE] review about to be saved: ${this._id}`);
  next();
});

const Review = mongoose.model<IReview>("Reviews", reviewSchema);
export default Review;
