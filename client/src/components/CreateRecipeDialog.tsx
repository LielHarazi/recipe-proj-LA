import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAuth } from "@/context/AuthContext";
import { useRecipes } from "@/hooks/useRecipes";

const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cookingTime: z.string().min(1, "Cooking time is required"),
  servings: z.string().min(1, "Servings is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;

interface CreateRecipeDialogProps {
  onRecipeCreated?: () => void;
}

export function CreateRecipeDialog({
  onRecipeCreated,
}: CreateRecipeDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const { createRecipe, isCreatingRecipe } = useRecipes();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>("");

  // Form state for dynamic arrays
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const updateArray = (arr: string[], index: number, value: string) => {
    const updated = [...arr];
    updated[index] = value;
    return updated;
  };

  const removeFromArray = (arr: string[], index: number) =>
    arr.length > 1 ? arr.filter((_, i) => i !== index) : arr;

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

  const resetForm = () => {
    form.reset();
    setIngredients([""]);
    setInstructions([""]);
    setTags([]);
    setNewTag("");
    setError("");
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) =>
    setIngredients(removeFromArray(ingredients, index));
  const updateIngredient = (index: number, value: string) =>
    setIngredients(updateArray(ingredients, index, value));

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (index: number) =>
    setInstructions(removeFromArray(instructions, index));
  const updateInstruction = (index: number, value: string) =>
    setInstructions(updateArray(instructions, index, value));

  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      cookingTime: "",
      servings: "",
      difficulty: "Easy",
    },
  });

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  const onSubmit = async (data: CreateRecipeSchema) => {
    if (!isAuthenticated || !user) {
      setError("You must be logged in to create recipes");
      return;
    }

    const validation = validateArrays();
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setError("");

    try {
      await createRecipe({
        ...data,
        description: data.description || "",
        ingredients: validation.validIngredients!,
        instructions: validation.validInstructions!,
        servings: parseInt(data.servings),
        dietaryRestrictions: tags,
        authorId: user.id,
        authorName: user.name,
      });

      resetForm();
      setIsOpen(false);
      onRecipeCreated?.();
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the recipe");
    }
  };

  if (!isAuthenticated) {
    return (
      <Button disabled className="bg-gray-400">
        Login to Create Recipe
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recipe</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of your recipe"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingredients */}
            <div className="space-y-3">
              <FormLabel>Ingredients</FormLabel>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <FormLabel>Instructions</FormLabel>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateInstruction(index, e.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    className="flex-1"
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInstruction}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            {/* Tags/Dietary Restrictions */}
            <div className="space-y-3">
              <FormLabel>
                Dietary Tags (e.g., Kosher, Vegan, Gluten-Free)
              </FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
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
              )}
            </div>

            {/* Recipe Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 30 minutes" />
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
                    <FormLabel>Servings</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="e.g., 4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingRecipe}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCreatingRecipe ? "Creating..." : "Create Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
