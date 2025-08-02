// const WEBHOOK_URL =
//   "https://discord.com/api/webhooks/1398978982564593725/y2MI9K7jH27k1TmQo9GslhCNLpJBJSdcvF0xDgTPojObsCauuGLG8HneM57m9n1jIJ7A";

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

// async function postToDiscord(
//   status: "new" | "update",
//   newPost: { title: string; content: string },
//   userName: string
// ) {
//   console.log("entered func");

//   const contentString = `${
//     status === "new" ? "new post created by:" : "Post edited! edited by:"
//   } ${userName}`;
//   try {
//     await axios.post(`${WEBHOOK_URL}`, {
//       content: contentString,
//       embeds: [
//         {
//           title: newPost.title,
//           description: newPost.content,
//           color: 3447003,
//         },
//       ],
//     });
//     console.log("disored posted");
//   } catch (error) {
//     console.log("_postToDiscord Error:");
//     console.log(error);
//     return new Error("something went erong");
//   }
// }
