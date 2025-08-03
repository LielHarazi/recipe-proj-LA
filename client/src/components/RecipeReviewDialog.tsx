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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare } from "lucide-react";

const reviewSchema = z.object({
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating cannot exceed 5 stars"),
});

type ReviewSchema = z.infer<typeof reviewSchema>;

interface RecipeReviewDialogProps {
  recipeId: string;
  recipeTitle: string;
  onReviewSubmitted?: () => void;
}

export function RecipeReviewDialog({
  recipeId,
  recipeTitle,
  onReviewSubmitted,
}: RecipeReviewDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: ReviewSchema) => {
    if (!isAuthenticated || !user) {
      setError("You must be logged in to write reviews");
      return;
    }

    if (selectedRating === 0) {
      setError("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // TODO: Replace with actual API call when server is ready
      const reviewData = {
        recipeId,
        rating: selectedRating,
        comment: data.comment,
        authorId: user.id,
        authorName: user.name,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just log the review data
      console.log("Review submitted:", reviewData);

      // Reset form and close dialog
      form.reset();
      setSelectedRating(0);
      setIsOpen(false);
      onReviewSubmitted?.();

      // Show success message (you could add a toast notification here)
      alert("Review submitted successfully!");
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  if (!isAuthenticated) {
    return (
      <Button disabled variant="outline" size="sm">
        <MessageSquare className="w-4 h-4 mr-2" />
        Login to Review
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review: {recipeTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Star Rating */}
            <div className="space-y-2">
              <FormLabel>Your Rating</FormLabel>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={selectedRating}
                  size="lg"
                  interactive={true}
                  onRatingChange={handleRatingChange}
                />
                <span className="text-sm text-gray-600">
                  {selectedRating > 0
                    ? `${selectedRating}/5 stars`
                    : "Select rating"}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your thoughts about this recipe..."
                      rows={4}
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 text-right">
                    {field.value?.length || 0}/500 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
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
                disabled={isSubmitting || selectedRating === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
