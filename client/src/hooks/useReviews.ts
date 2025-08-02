import { useState, useCallback } from "react";
import type { review } from "@/types";

interface CreateReviewData {
  title: string;
  content: string;
  rating: number;
  recipeId?: string;
}

export const useReviews = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = useCallback(async (reviewData: CreateReviewData) => {
    setIsSubmitting(true);

    try {
      // When you implement the server, this will be a real API call
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          authorId: "current-user-id", // This will come from auth context
          authorName: "Current User", // This will come from auth context
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Error submitting review:", error);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const getReviewsByRecipe = useCallback(async (recipeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reviews/recipe/${recipeId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const reviews = await response.json();
      return { success: true, data: reviews };
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const calculateAverageRating = useCallback((reviews: review[]) => {
    if (!reviews.length) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
  }, []);

  const getRatingDistribution = useCallback((reviews: review[]) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    return distribution;
  }, []);

  return {
    submitReview,
    getReviewsByRecipe,
    calculateAverageRating,
    getRatingDistribution,
    isSubmitting,
  };
};

export default useReviews;
