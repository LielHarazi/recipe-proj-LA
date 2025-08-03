import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "@/lib/api";

export const useReviews = (recipeId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews", recipeId],
    queryFn: async () => {
      const response = await reviewsAPI.getReviews(recipeId);
      console.log("Reviews API response:", response);

      if (response.success) {
        // Handle nested data structure like recipes
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data && Array.isArray(response.data.reviews)) {
          return response.data.reviews;
        }
        // Try to find any array in the response
        if (response.data && typeof response.data === "object") {
          const values = Object.values(response.data);
          const arrayValue = values.find((val) => Array.isArray(val));
          if (arrayValue) {
            return arrayValue;
          }
        }
      }
      return [];
    },
    enabled: !!recipeId, // Only run if recipeId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      recipeId: string;
      title?: string;
      content: string;
      rating: number;
    }) => {
      // Map frontend fields to backend expected fields
      const backendData = {
        recipeId: reviewData.recipeId,
        rating: reviewData.rating,
        comment: reviewData.content, // Backend expects 'comment', not 'content'
      };

      const response = await reviewsAPI.createReview(backendData);
      if (!response.success) {
        throw new Error(
          response.error || response.message || "Failed to create review"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", recipeId] });
    },
  });

  return {
    reviews: reviewsData || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createReview: createReviewMutation.mutateAsync,
    isCreatingReview: createReviewMutation.isPending,
  };
};
