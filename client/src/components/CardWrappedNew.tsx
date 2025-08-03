import { useState } from "react";
import { RecipeCard } from "./RecipeCard";
import { RecipeDialog } from "./RecipeDialog";
import { CreateRecipeDialog } from "./CreateRecipeDialog";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
import { useRecipes } from "@/hooks/useRecipes";
import type { recipe } from "@/types";

export function CardWrapped() {
  const [selectedRecipe, setSelectedRecipe] = useState<recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { savedRecipes, handleSaveRecipe, isRecipeSaved } = useSavedRecipes();

  // Use API recipes when available, fallback to static data only when needed
  const { recipes: apiRecipes, refetch, isLoading, error } = useRecipes();

  // Debug info
  console.log("API Recipes:", apiRecipes);
  console.log("API Loading:", isLoading);
  console.log("API Error:", error);

  // Use only API recipes - no fallback to static data
  const allRecipes = Array.isArray(apiRecipes) ? apiRecipes : [];
  console.log("All Recipes after processing:", allRecipes);

  const filteredRecipes = useRecipeFilters(allRecipes);
  console.log("Filtered Recipes:", filteredRecipes);

  const openRecipeDialog = (recipe: recipe) => {
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const closeRecipeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecipe(null);
  };

  const handleRecipeCreated = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-6">
      {/* Status indicator */}
      {isLoading && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">
          Loading recipes from server...
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          Error loading from server: {error}. Please try again later.
        </div>
      )}
      {!isLoading && !error && apiRecipes.length === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
          No recipes found. Create your first recipe!
        </div>
      )}
      {!isLoading && !error && apiRecipes.length > 0 && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          Loaded {apiRecipes.length} recipes from server.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-orange-600 text-2xl font-bold text-center">
          Our Recipes ({filteredRecipes.length})
        </h2>

        <div className="flex items-center gap-4">
          {/* Create Recipe Button */}
          <CreateRecipeDialog onRecipeCreated={handleRecipeCreated} />

          {/* Saved Recipes Counter */}
          <div className="bg-white rounded-lg px-4 py-2 shadow-md">
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <span className="font-medium">Saved Recipes</span>
              {savedRecipes.length > 0 && (
                <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {savedRecipes.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isRecipeSaved={isRecipeSaved}
            onSaveRecipe={handleSaveRecipe}
            onViewDetails={openRecipeDialog}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No recipes match your selected filters.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filter selection.
          </p>
        </div>
      )}

      {/* Recipe Details Dialog */}
      <RecipeDialog
        recipe={selectedRecipe}
        isOpen={isDialogOpen}
        onClose={closeRecipeDialog}
        isRecipeSaved={isRecipeSaved}
        onSaveRecipe={handleSaveRecipe}
      />
    </div>
  );
}
