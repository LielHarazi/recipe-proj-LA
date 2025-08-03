export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  avatar?: string;
  role?: string;
  bio?: string;
  joinDate?: string;
}

export interface review {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  dietaryRestrictions?: string[];
  cookingTime?: string;
  servings?: number;
  difficulty?: string;
  image?: string;
  description?: string;
  chef?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  featured: boolean;
  rating?: number; // 1-5 stars for review posts
}
