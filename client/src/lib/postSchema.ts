import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(2000, "Content must be less than 2000 characters"),
  category: z.enum(["recipe", "tips", "review", "announcement", "deal"]),
  featured: z.boolean().optional().default(false),
  rating: z.number().min(1).max(5).optional(), // 1-5 stars for review posts
});

export type PostFormData = z.infer<typeof postSchema>;
