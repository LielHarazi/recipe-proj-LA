import { useState } from "react";
import { recipes } from "@/data/recipes";
import { RecipeCard } from "./RecipeCard";
import { RecipeDialog } from "./RecipeDialog";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
import type { recipe } from "@/types";

export function CardWrapped() {
  const [selectedRecipe, setSelectedRecipe] = useState<recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { savedRecipes, handleSaveRecipe, isRecipeSaved } = useSavedRecipes();
  const filteredRecipes = useRecipeFilters(recipes);

  const openRecipeDialog = (recipe: recipe) => {
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const closeRecipeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-orange-600 text-2xl font-bold text-center">
          Our Recipes ({filteredRecipes.length})
        </h2>

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
