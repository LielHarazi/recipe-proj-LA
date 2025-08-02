import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { formatCategoryName, getDifficultyColor } from "@/data/recipes";
import type { Recipe } from "@/data/recipes";

interface RecipeDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isRecipeSaved: (id: string) => boolean;
  onSaveRecipe: (id: string) => void;
}

export function RecipeDialog({
  recipe,
  isOpen,
  onClose,
  isRecipeSaved,
  onSaveRecipe,
}: RecipeDialogProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            {recipe.title}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {recipe.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Chef and Recipe Info */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div>
              <p className="text-lg font-semibold text-orange-600">
                👨‍🍳 Chef {recipe.chef}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>⏱️ {recipe.cookingTime}</span>
                <span>👥 {recipe.servings} servings</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    recipe.difficulty
                  )}`}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Categories and Dietary Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                {formatCategoryName(recipe.category)}
              </span>
              {recipe.dietaryRestrictions
                .filter((restriction) => restriction !== recipe.category)
                .map((restriction) => (
                  <span
                    key={restriction}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {formatCategoryName(restriction)}
                  </span>
                ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🥘 Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 Instructions
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => onSaveRecipe(recipe.id)}
              className={`flex-1 transition-colors ${
                isRecipeSaved(recipe.id)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white`}
            >
              {isRecipeSaved(recipe.id) ? "❤️ Saved" : "🤍 Save Recipe"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
