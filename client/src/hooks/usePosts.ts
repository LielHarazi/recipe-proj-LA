import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, User } from "@/types";

interface PostsData {
  posts: Post[];
  users: User[];
}

const fetchPosts = async (): Promise<PostsData> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts");

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching posts:", err);
    return {
      posts: [
        {
          id: "1",
          title: "Welcome to L&H Recipe!",
          content:
            "Discover amazing recipes from talented chefs around the world. Share your own culinary creations and connect with fellow food lovers.",
          author: {
            id: "1",
            name: "Chef Maria",
            role: "Head Chef",
            avatar:
              "https://ui-avatars.com/api/?name=Chef+Maria&background=random",
          },
          category: "announcement",
          timestamp: new Date().toISOString(),
          likes: 45,
          comments: 12,
          featured: true,
        },
        {
          id: "2",
          title: "Perfect Pasta Techniques",
          content:
            "Learn the secrets to cooking perfect pasta every time. From al dente timing to sauce pairing, master the art of Italian cuisine.",
          author: {
            id: "2",
            name: "Chef Giovanni",
            role: "Italian Cuisine Expert",
            avatar:
              "https://ui-avatars.com/api/?name=Chef+Giovanni&background=random",
          },
          category: "tips",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          likes: 32,
          comments: 8,
          featured: false,
        },
        {
          id: "3",
          title: "Vegan Cooking Made Easy",
          content:
            "Discover delicious plant-based recipes that will satisfy even the most devoted meat lovers. Simple techniques for incredible flavor.",
          author: {
            id: "3",
            name: "Chef Sarah",
            role: "Vegan Specialist",
            avatar:
              "https://ui-avatars.com/api/?name=Chef+Sarah&background=random",
          },
          category: "recipe",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          likes: 28,
          comments: 15,
          featured: true,
        },
        {
          id: "4",
          title: "Amazing Carbonara Experience!",
          content:
            "I tried the Classic Spaghetti Carbonara recipe and it was absolutely delicious! The technique was perfect and the flavors were authentic. Highly recommend this recipe to anyone looking for real Italian taste.",
          author: {
            id: "4",
            name: "Food Lover Mike",
            role: "Home Cook",
            avatar: "https://ui-avatars.com/api/?name=Mike&background=random",
          },
          category: "review",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          likes: 15,
          comments: 3,
          featured: false,
          rating: 5,
        },
        {
          id: "5",
          title: "Good Buddha Bowl Recipe",
          content:
            "The Vegan Buddha Bowl was nutritious and tasty. The tahini dressing really made the difference. Could use a bit more seasoning on the vegetables though.",
          author: {
            id: "5",
            name: "Healthy Eater Jane",
            role: "Nutrition Enthusiast",
            avatar: "https://ui-avatars.com/api/?name=Jane&background=random",
          },
          category: "review",
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          likes: 8,
          comments: 2,
          featured: false,
          rating: 4,
        },
        {
          id: "6",
          title: "Chocolate Cake Was Okay",
          content:
            "The Chocolate Lava Cake recipe was decent but didn't turn out as molten as expected. Maybe I overbaked it slightly. The flavor was good though.",
          author: {
            id: "6",
            name: "Baker Bob",
            role: "Amateur Baker",
            avatar: "https://ui-avatars.com/api/?name=Bob&background=random",
          },
          category: "review",
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          likes: 5,
          comments: 1,
          featured: false,
          rating: 3,
        },
      ],
      users: [
        {
          id: "1",
          name: "Chef Maria",
          email: "maria@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-01-15"),
        },
        {
          id: "2",
          name: "Chef Giovanni",
          email: "giovanni@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-02-20"),
        },
        {
          id: "3",
          name: "Chef Sarah",
          email: "sarah@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-03-10"),
        },
        {
          id: "4",
          name: "Food Lover Mike",
          email: "mike@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-04-01"),
        },
        {
          id: "5",
          name: "Healthy Eater Jane",
          email: "jane@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-04-15"),
        },
        {
          id: "6",
          name: "Baker Bob",
          email: "bob@recipehaven.com",
          password: "password123",
          createdAt: new Date("2023-05-01"),
        },
      ],
    };
  }
};

export const usePosts = () => {
  const queryClient = useQueryClient();

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
  });

  const createPostMutation = useMutation({
    mutationFn: async (
      newPost: Omit<Post, "id" | "timestamp" | "likes" | "comments">
    ) => {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    postsData,
    isLoading,
    error: error?.message || null,
    refetch,
    createPost: createPostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
  };
};
