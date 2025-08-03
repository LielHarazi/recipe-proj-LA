import React, { createContext, useContext, useState } from "react";
import type { recipe } from "@/types";

interface FilterState {
  dietaryRestrictions: string[];
  cookingTimes: string[];
  difficulty: string[];
  searchTerm: string;
}

interface FilterContextType {
  filters: FilterState;
  setDietaryFilter: (tag: string, checked: boolean) => void;
  setCookingTimeFilter: (time: string, checked: boolean) => void;
  setDifficultyFilter: (difficulty: string, checked: boolean) => void;
  setSearchTerm: (term: string) => void;
  clearAllFilters: () => void;
  availableTags: string[];
  filteredRecipes: recipe[];
  setRecipes: (recipes: recipe[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dietaryRestrictions: [],
    cookingTimes: [],
    difficulty: [],
    searchTerm: "",
  });

  // Extract all unique dietary restrictions from recipes
  const availableTags = React.useMemo(() => {
    const tags = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.dietaryRestrictions) {
        recipe.dietaryRestrictions.forEach((tag) => tags.add(tag));
      }
      if (recipe.category) {
        tags.add(recipe.category);
      }
    });
    return Array.from(tags).sort();
  }, [recipes]);

  // Filter recipes based on current filters
  const filteredRecipes = React.useMemo(() => {
    return recipes.filter((recipe) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.description?.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((ing) =>
            ing.toLowerCase().includes(searchLower)
          );

        if (!matchesSearch) return false;
      }

      // Dietary restrictions filter
      if (filters.dietaryRestrictions.length > 0) {
        const hasMatchingTag = filters.dietaryRestrictions.some(
          (tag) =>
            recipe.category === tag || recipe.dietaryRestrictions?.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Cooking time filter
      if (filters.cookingTimes.length > 0) {
        const cookingTime = parseInt(recipe.cookingTime || "0");
        const matchesTime = filters.cookingTimes.some((timeFilter) => {
          switch (timeFilter) {
            case "quick":
              return cookingTime <= 30;
            case "medium":
              return cookingTime > 30 && cookingTime <= 60;
            case "long":
              return cookingTime > 60;
            default:
              return false;
          }
        });
        if (!matchesTime) return false;
      }

      // Difficulty filter
      if (filters.difficulty.length > 0) {
        if (
          !recipe.difficulty ||
          !filters.difficulty.includes(recipe.difficulty)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, filters]);

  const setDietaryFilter = (tag: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, tag]
        : prev.dietaryRestrictions.filter((t) => t !== tag),
    }));
  };

  const setCookingTimeFilter = (time: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      cookingTimes: checked
        ? [...prev.cookingTimes, time]
        : prev.cookingTimes.filter((t) => t !== time),
    }));
  };

  const setDifficultyFilter = (difficulty: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: checked
        ? [...prev.difficulty, difficulty]
        : prev.difficulty.filter((d) => d !== difficulty),
    }));
  };

  const setSearchTerm = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: term,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dietaryRestrictions: [],
      cookingTimes: [],
      difficulty: [],
      searchTerm: "",
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setDietaryFilter,
        setCookingTimeFilter,
        setDifficultyFilter,
        setSearchTerm,
        clearAllFilters,
        availableTags,
        filteredRecipes,
        setRecipes,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
