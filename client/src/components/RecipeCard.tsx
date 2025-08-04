import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { formatCategoryName, getDifficultyColor } from "@/lib/recipeUtils";
import { useAuth } from "@/context/AuthContext";
import { useRecipes } from "@/hooks/useRecipes";
import type { recipe } from "@/types";

interface RecipeCardProps {
  recipe: recipe;
  isRecipeSaved?: (id: string) => boolean;
  onSaveRecipe?: (id: string) => void;
  onViewDetails: (recipe: recipe) => void;
}

export function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  const { user } = useAuth();
  const { deleteRecipe, isDeletingRecipe } = useRecipes();

  // Debug: Log the recipe data to understand the structure
  console.log("Recipe data:", recipe);
  console.log("User:", user);

  // Get author info from addedBy or fallback to authorId/authorName
  const authorId = recipe.addedBy?._id || recipe.authorId;
  const authorName = recipe.addedBy?.name || recipe.authorName;

  // Check if user can delete (compare with user id in both formats)
  const canDelete = user && (authorId === user.id || authorId === user._id);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        // Use _id if available, otherwise fall back to id
        const recipeId = recipe._id || recipe.id;
        console.log("Attempting to delete recipe with ID:", recipeId);
        console.log("Recipe object:", recipe);
        console.log("User object:", user);
        await deleteRecipe(recipeId);
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete recipe. Please try again.");
      }
    }
  };
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-orange-600">
              Chef {authorName || recipe.chef || "Unknown"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                recipe.difficulty || "Easy"
              )}`}
            >
              {recipe.difficulty || "Easy"}
            </span>
          </div>

          {/* Author information */}
          {authorName && (
            <div className="text-sm text-gray-600">
              Created by: <span className="font-medium">{authorName}</span>
              {user && (authorId === user.id || authorId === user._id) && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Your Recipe
                </span>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>⏱️ {recipe.cookingTime}</span>
            <span>👥 {recipe.servings} servings</span>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {formatCategoryName(recipe.category || "")}
            </span>
            {recipe.tags &&
              recipe.tags
                .filter((tag: string) => tag !== recipe.category)
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {formatCategoryName(tag)}
                  </span>
                ))}
          </div>

          <div className="mt-4 space-y-2">
            <Button
              onClick={() => onViewDetails(recipe)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Recipe Details
            </Button>
            {canDelete && (
              <Button
                onClick={handleDelete}
                disabled={isDeletingRecipe}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isDeletingRecipe ? "Deleting..." : "🗑️ Delete Recipe"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
