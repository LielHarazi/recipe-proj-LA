import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RecipeReviewDialog } from "./RecipeReviewDialog";
import { formatCategoryName, getDifficultyColor } from "@/lib/recipeUtils";
import { useReviews } from "@/hooks/useReviews";
import type { recipe } from "@/types";

interface RecipeDialogProps {
  recipe: recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isRecipeSaved?: (id: string) => boolean;
  onSaveRecipe?: (id: string) => void;
}

export function RecipeDialog({ recipe, isOpen, onClose }: RecipeDialogProps) {
  const {
    reviews,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useReviews(recipe?._id);

  if (!recipe) return null;
  if (!recipe._id) return null;

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
                    recipe.difficulty || "Easy"
                  )}`}
                >
                  {recipe.difficulty || "Easy"}
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
                {formatCategoryName(recipe.category || "")}
              </span>
              {recipe.tags &&
                recipe.tags
                  .filter((tag: string) => tag !== recipe.category)
                  .map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {formatCategoryName(tag)}
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
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex justify-center">
              <Button onClick={onClose} variant="outline" className="px-8">
                Close
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Reviews
              </h3>
              {reviewsLoading ? (
                <p className="text-center text-gray-600">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id || review._id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{review.authorName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-medium mb-1">{review.title}</h4>
                      )}
                      <p className="text-gray-700">
                        {review.content || review.comment}
                      </p>
                      {review.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>

            {/* Review Section */}
            <div className="flex justify-center">
              <RecipeReviewDialog
                recipeId={recipe._id}
                recipeTitle={recipe.title}
                onReviewSubmitted={() => {
                  refetchReviews();
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
