import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipesAPI } from "@/lib/api";
import type { recipe } from "@/types";

export const useRecipes = () => {
  const queryClient = useQueryClient();

  const {
    data: recipesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await recipesAPI.getRecipes();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createRecipeMutation = useMutation({
    mutationFn: async (
      newRecipe: Omit<recipe, "id" | "createdAt" | "updatedAt">
    ) => {
      const response = await recipesAPI.createRecipe(newRecipe);
      if (!response.success) {
        throw new Error(response.error || "Failed to create recipe");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  return {
    recipes: recipesData || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createRecipe: createRecipeMutation.mutateAsync,
    isCreatingRecipe: createRecipeMutation.isPending,
  };
};
