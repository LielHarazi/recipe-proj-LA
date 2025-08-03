import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSchema, type PostFormData } from "@/lib/postSchema";
import { postsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      featured: false,
      rating: 1,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: postsAPI.createPost,
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      setSubmitError(error.message || "Failed to create post");
      setSubmitSuccess(false);
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      setSubmitError("You must be logged in to create a post");
      return;
    }

    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      await createPostMutation.mutateAsync(data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Share a Recipe or Cooking Tip
      </h3>

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            Recipe post created successfully!
          </p>
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipe or Tip Title *
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your recipe title or cooking tip..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category *
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select a category...</option>
            <option value="recipe">Recipe</option>
            <option value="tips">Cooking Tips</option>
            <option value="review">Restaurant Review</option>
            <option value="announcement">Announcement</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipe Details or Tips *
          </label>
          <textarea
            {...register("content")}
            id="content"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
            placeholder="Share your recipe ingredients, cooking instructions, or culinary tips..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createPostMutation.isPending}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createPostMutation.isPending ? "Sharing Recipe..." : "Share Recipe"}
        </Button>
      </form>
    </div>
  );
}
