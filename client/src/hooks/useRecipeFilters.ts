import { useState, useEffect } from "react";
import type { recipe } from "@/types";

export function useRecipeFilters(recipes: recipe[]) {
  const [filteredRecipes, setFilteredRecipes] = useState<recipe[]>(recipes);

  useEffect(() => {
    const updateFilters = () => {
      const checkedDietary = Array.from(
        document.querySelectorAll(
          'input[type="checkbox"][id^="meat"], input[type="checkbox"][id^="vegan"], input[type="checkbox"][id^="kosher"], input[type="checkbox"][id^="dessert"], input[type="checkbox"][id^="gluten-free"]'
        )
      )
        .filter((checkbox: any) => checkbox.checked)
        .map((checkbox: any) => checkbox.id);

      const checkedTimes = Array.from(
        document.querySelectorAll(
          'input[type="checkbox"][id^="quick"], input[type="checkbox"][id^="medium"], input[type="checkbox"][id^="long"]'
        )
      )
        .filter((checkbox: any) => checkbox.checked)
        .map((checkbox: any) => checkbox.id);

      const filtered = recipes.filter((recipe) => {
        const dietaryMatch =
          checkedDietary.length === 0 ||
          checkedDietary.some(
            (dietary) =>
              recipe.category === dietary ||
              (recipe.dietaryRestrictions &&
                recipe.dietaryRestrictions.includes(dietary))
          );

        const timeMatch =
          checkedTimes.length === 0 ||
          checkedTimes.some((time) => {
            if (!recipe.cookingTime) return false;
            if (time === "quick") return parseInt(recipe.cookingTime) <= 30;
            if (time === "medium")
              return (
                parseInt(recipe.cookingTime) > 30 &&
                parseInt(recipe.cookingTime) <= 60
              );
            if (time === "long") return parseInt(recipe.cookingTime) > 60;
            return false;
          });

        return dietaryMatch && timeMatch;
      });

      setFilteredRecipes(filtered);
    };

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateFilters);
    });

    updateFilters();

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener("change", updateFilters);
      });
    };
  }, [recipes]);

  return filteredRecipes;
}
