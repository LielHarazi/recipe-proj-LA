import React from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating || rating;
    if (starIndex <= currentRating) {
      return "text-yellow-400 fill-current";
    }
    return "text-gray-300";
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <svg
            key={index}
            className={`${sizeClasses[size]} ${getStarFill(starValue)} ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            }`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
      {interactive && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverRating || rating} / {maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;
