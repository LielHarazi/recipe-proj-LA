import { z } from "zod";

export const recipeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  chef: z.string().min(2, "Chef name must be at least 2 characters"),
  ingredients: z
    .array(z.string().min(1, "Ingredient cannot be empty"))
    .min(1, "At least one ingredient is required"),
  instructions: z
    .string()
    .min(20, "Instructions must be at least 20 characters"),
  category: z.enum([
    "meat",
    "vegan",
    "kosher",
    "dessert",
    "gluten-free",
    "quick",
  ]),
  tags: z.array(z.string()).optional().default([]),
  cookingTime: z
    .string()
    .regex(
      /^\d+\s*(min|hour|hours)$/,
      "Cooking time must be in format '30 min' or '2 hours'"
    ),
  servings: z
    .number()
    .min(1, "Must serve at least 1 person")
    .max(20, "Cannot serve more than 20 people"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  image: z.string().url("Must be a valid URL").optional(),
});

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(2000, "Content must be less than 2000 characters"),
  category: z.enum(["recipe", "tips", "review", "announcement"]),
  featured: z.boolean().optional().default(false),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
