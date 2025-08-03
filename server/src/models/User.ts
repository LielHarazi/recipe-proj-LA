import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types";
import Recipe from "./Recipe.model";
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre(/delete/i, async function (this: any, next) {
  const userId = this.getQuery()._id;
  if (!userId) {
    console.log("[User Delete] No user ID provided");
    return next();
  }
  const recipes = await Recipe.find({ addedBy: userId });
  for (const recipe of recipes) {
    await recipe.deleteOne();
  }
  next();
});
const User = mongoose.model<IUser>("User", userSchema);
export default User;
