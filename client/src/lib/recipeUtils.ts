export const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "hard":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};
