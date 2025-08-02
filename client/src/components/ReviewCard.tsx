import React from "react";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Post } from "@/types";

interface ReviewCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  post,
  onLike,
  onComment,
}) => {
  // Debug logging
  console.log("ReviewCard - Post data:", post);
  console.log("ReviewCard - Rating:", post.rating);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {formatTimestamp(post.timestamp)}
        </div>
      </div>

      {/* Review Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>

      {/* Star Rating */}
      {post.rating && (
        <div className="mb-3 flex items-center">
          <StarRating rating={post.rating} size="md" />
          <span className="text-sm text-gray-600 ml-2">
            {post.rating}/5 stars
          </span>
        </div>
      )}

      {/* Review Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Review
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike?.(post.id)}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm">{post.likes}</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{post.comments}</span>
        </button>

        {post.featured && (
          <div className="flex items-center">
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
