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
      console.log("Raw API response:", response);
      console.log("Response data type:", typeof response.data);
      console.log("Response data:", response.data);

      // Handle the response structure properly
      if (response.success) {
        // Check if data is an array
        if (Array.isArray(response.data)) {
          console.log("Data is array with length:", response.data.length);
          return response.data;
        }
        // Check if data.data is an array (nested data structure)
        if (response.data && Array.isArray(response.data.data)) {
          console.log(
            "Found nested data array with length:",
            response.data.data.length
          );
          return response.data.data;
        }
        // If data is an object with recipes property
        if (response.data && Array.isArray(response.data.recipes)) {
          console.log(
            "Found recipes array with length:",
            response.data.recipes.length
          );
          return response.data.recipes;
        }
        // If data is an object, try to extract array values
        if (response.data && typeof response.data === "object") {
          console.log("Data structure:", Object.keys(response.data));
          const values = Object.values(response.data);
          const arrayValue = values.find((val) => Array.isArray(val));
          if (arrayValue) {
            console.log("Found array value with length:", arrayValue.length);
            return arrayValue;
          }
        }
      }
      console.warn("No valid recipe array found in response");
      return [];
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

  const deleteRecipeMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await recipesAPI.deleteRecipe(recipeId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete recipe");
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
    deleteRecipe: deleteRecipeMutation.mutateAsync,
    isDeletingRecipe: deleteRecipeMutation.isPending,
  };
};
