import mongoose, { Document, Types } from "mongoose";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  createdAt: Date;
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthPayload {
  userId: Types.ObjectId;
  email: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  description?: string;
  publishedYear?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
// export interface IReview {
//   id: string;
//   title: string;
//   content: string;
//   rating: number;
//   authorId: string;
//   authorName: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  recipe: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IRecipe {
  _id: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId;
  title: string;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}
