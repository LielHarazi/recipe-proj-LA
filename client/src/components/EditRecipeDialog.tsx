import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRecipes } from "@/hooks/useRecipes";
import type { recipe } from "@/types";

const editRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cookingTime: z.string().min(1, "Cooking time is required"),
  servings: z.string().min(1, "Servings is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

type EditRecipeSchema = z.infer<typeof editRecipeSchema>;

interface EditRecipeDialogProps {
  recipe: recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onRecipeUpdated?: () => void;
}

export function EditRecipeDialog({
  recipe,
  isOpen,
  onClose,
  onRecipeUpdated,
}: EditRecipeDialogProps) {
  const { updateRecipe, isUpdatingRecipe } = useRecipes();
  const [error, setError] = useState<string>("");

  // Form state for dynamic arrays
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [currentTag, setCurrentTag] = useState("");

  const form = useForm<EditRecipeSchema>({
    resolver: zodResolver(editRecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      cookingTime: "",
      servings: "",
      difficulty: "Easy",
    },
  });

  // Populate form when recipe changes
  useEffect(() => {
    if (recipe && isOpen) {
      form.reset({
        title: recipe.title || "",
        description: recipe.description || "",
        cookingTime: recipe.cookingTime || "",
        servings: recipe.servings?.toString() || "",
        difficulty: (recipe.difficulty as "Easy" | "Medium" | "Hard") || "Easy",
      });

      setIngredients(recipe.ingredients || []);
      setInstructions(
        Array.isArray(recipe.instructions)
          ? recipe.instructions
          : [recipe.instructions || ""]
      );
      setTags(recipe.tags || []);
    }
  }, [recipe, isOpen, form]);

  const resetForm = () => {
    form.reset();
    setIngredients([]);
    setInstructions([]);
    setTags([]);
    setCurrentIngredient("");
    setCurrentInstruction("");
    setCurrentTag("");
    setError("");
  };

  const validateArrays = () => {
    const validIngredients = ingredients.filter((ing) => ing.trim() !== "");
    const validInstructions = instructions.filter((inst) => inst.trim() !== "");

    if (validIngredients.length === 0) {
      return { error: "At least one ingredient is required" };
    }
    if (validInstructions.length === 0) {
      return { error: "At least one instruction is required" };
    }

    return { validIngredients, validInstructions };
  };

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const addInstruction = () => {
    if (currentInstruction.trim()) {
      setInstructions([...instructions, currentInstruction.trim()]);
      setCurrentInstruction("");
    }
  };

  const removeInstruction = (index: number) =>
    setInstructions(instructions.filter((_, i) => i !== index));

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  const onSubmit = async (data: EditRecipeSchema) => {
    if (!recipe) return;

    const validation = validateArrays();
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setError("");

    try {
      const recipeId = recipe._id || recipe.id;
      await updateRecipe({
        recipeId,
        updatedData: {
          ...data,
          description: data.description || "",
          ingredients: validation.validIngredients!,
          instructions: validation.validInstructions!,
          servings: parseInt(data.servings),
          tags: tags,
        },
      });

      resetForm();
      onClose();
      onRecipeUpdated?.();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the recipe");
    }
  };

  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter recipe title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of your recipe"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ingredients *
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  placeholder="Add an ingredient"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addIngredient())
                  }
                />
                <Button type="button" onClick={addIngredient} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{ingredient}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructions *
              </label>
              <div className="flex gap-2 mb-2">
                <Textarea
                  value={currentInstruction}
                  onChange={(e) => setCurrentInstruction(e.target.value)}
                  placeholder="Add a cooking step"
                  rows={2}
                />
                <Button type="button" onClick={addInstruction} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between bg-gray-50 p-3 rounded"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-sm text-gray-600">
                        Step {index + 1}:
                      </span>
                      <p className="text-sm mt-1">{instruction}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Time *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 30 min" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="e.g., 4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingRecipe}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isUpdatingRecipe ? "Updating..." : "Update Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
