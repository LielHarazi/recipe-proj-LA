import type { recipe } from "@/types";

export const recipes: recipe[] = [
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pecorino Romano",
      "Pancetta",
      "Black Pepper",
    ],
    instructions: [
      "Cook pasta al dente",
      "Mix eggs with cheese",
      "Add pancetta and combine",
    ],
    authorId: "marco-1",
    authorName: "Marco",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    category: "meat",
    dietaryRestrictions: [],
    cookingTime: "25",
    servings: 4,
    difficulty: "Medium",
    description: "Authentic Italian pasta dish with eggs, cheese, and pancetta",
    chef: "Marco",
  },
  {
    id: "2",
    title: "Vegan Buddha Bowl",
    ingredients: ["Quinoa", "Sweet Potato", "Chickpeas", "Spinach", "Tahini"],
    instructions: [
      "Cook quinoa",
      "Roast vegetables",
      "Prepare tahini dressing",
      "Combine all ingredients",
    ],
    authorId: "sarah-1",
    authorName: "Sarah",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    category: "vegan",
    dietaryRestrictions: ["vegan"],
    cookingTime: "30",
    servings: 2,
    difficulty: "Easy",
    description:
      "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
    chef: "Sarah",
  },
  {
    id: "3",
    title: "Chocolate Lava Cake",
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour"],
    instructions: [
      "Melt chocolate with butter",
      "Mix with eggs and sugar",
      "Add flour",
      "Bake in ramekins",
    ],
    authorId: "chef-1",
    authorName: "Chef Pierre",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
    category: "dessert",
    dietaryRestrictions: [],
    cookingTime: "20",
    servings: 4,
    difficulty: "Hard",
    description: "Rich, gooey chocolate dessert with a molten center",
    chef: "Pierre",
  },
  {
    id: "4",
    title: "Chicken Soup",
    ingredients: ["Chicken", "Vegetables", "Matzo Balls", "Herbs"],
    instructions: [
      "Simmer chicken with vegetables",
      "Prepare matzo balls",
      "Combine and season",
    ],
    authorId: "maria-1",
    authorName: "Maria",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
    category: "meat",
    dietaryRestrictions: [],
    cookingTime: "90",
    servings: 6,
    difficulty: "Medium",
    description: "Comforting homemade chicken soup with matzo balls",
    chef: "Maria",
  },
  {
    id: "5",
    title: "Margherita Pizza",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil"],
    instructions: [
      "Roll out dough",
      "Add sauce and toppings",
      "Bake until crispy",
    ],
    authorId: "giovanni-1",
    authorName: "Giovanni",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
    category: "meat",
    dietaryRestrictions: [],
    cookingTime: "45",
    servings: 2,
    difficulty: "Medium",
    description: "Classic Italian pizza with tomato, mozzarella, and basil",
    chef: "Giovanni",
    image: "/api/placeholder/300/200",
  },
];

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
