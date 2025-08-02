import { useState } from "react";

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveRecipe = (recipeId: string) => {
    setSavedRecipes((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      return updated;
    });
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.includes(recipeId);
  };

  return {
    savedRecipes,
    handleSaveRecipe,
    isRecipeSaved,
  };
}
