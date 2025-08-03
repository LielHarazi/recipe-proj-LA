import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { formatCategoryName, getDifficultyColor } from "@/data/recipes";
import type { recipe } from "@/types";

interface RecipeCardProps {
  recipe: recipe;
  isRecipeSaved: (id: string) => boolean;
  onSaveRecipe: (id: string) => void;
  onViewDetails: (recipe: recipe) => void;
}

export function RecipeCard({
  recipe,
  isRecipeSaved,
  onSaveRecipe,
  onViewDetails,
}: RecipeCardProps) {
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
              Chef {recipe.chef}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                recipe.difficulty || "Easy"
              )}`}
            >
              {recipe.difficulty || "Easy"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>⏱️ {recipe.cookingTime}</span>
            <span>👥 {recipe.servings} servings</span>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {formatCategoryName(recipe.category || "")}
            </span>
            {recipe.dietaryRestrictions &&
              recipe.dietaryRestrictions
                .filter(
                  (restriction: string) => restriction !== recipe.category
                )
                .map((restriction: string) => (
                  <span
                    key={restriction}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {formatCategoryName(restriction)}
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
            <Button
              onClick={() => onSaveRecipe(recipe.id)}
              className={`w-full transition-colors ${
                isRecipeSaved(recipe.id)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white`}
            >
              {isRecipeSaved(recipe.id) ? "❤️ Saved" : "🤍 Save Recipe"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
