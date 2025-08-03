import React, { useState } from "react";

import { StarRating } from "./StarRating";
import { Button } from "./ui/button";

interface ReviewFormProps {
  onSubmit: (review: {
    title: string;
    content: string;
    rating: number;
    recipeId?: string;
  }) => void;
  onCancel?: () => void;
  recipeId?: string;
  recipeName?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  recipeId,
  recipeName,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || rating === 0) {
      alert("Please fill in all fields and select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        rating,
        recipeId,
      });

      // Reset form
      setTitle("");
      setContent("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {recipeName ? `Review: ${recipeName}` : "Write a Review"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Share your experience and help others discover great recipes!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Review Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            maxLength={100}
          />
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
            className="mb-2"
          />
          {rating === 0 && (
            <p className="text-xs text-gray-500">Click on a star to rate</p>
          )}
        </div>

        {/* Review Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us about your experience with this recipe..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.length}/1000 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              isSubmitting || !title.trim() || !content.trim() || rating === 0
            }
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
