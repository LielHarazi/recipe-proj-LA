const API_BASE_URL = "http://localhost:3000/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const authAPI = {
  login: async (credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // הוספת cookies
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // הוספת cookies
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  },
};

export const postsAPI = {
  getPosts: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        credentials: "include", // הוספת cookies
      });
      const data = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch posts",
      };
    }
  },

  createPost: async (postData: {
    title: string;
    content: string;
    category: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // הוספת cookies
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create post",
      };
    }
  },
};

export const recipesAPI = {
  getRecipes: async (): Promise<ApiResponse> => {
    try {
      console.log("Making API call to:", `${API_BASE_URL}/recipes`);
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        credentials: "include", // הוספת cookies
      });
      console.log("API response status:", response.status, response.ok);

      const data = await response.json();
      console.log("API response data:", data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      console.error("API call failed:", error);
      return {
        success: false,
        error: "Failed to fetch recipes",
      };
    }
  },

  createRecipe: async (recipeData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // הוספת cookies
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create recipe",
      };
    }
  },

  deleteRecipe: async (recipeId: string): Promise<ApiResponse> => {
    try {
      console.log("Deleting recipe with ID:", recipeId);
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Delete response status:", response.status);
      const data = await response.json();
      console.log("Delete response data:", data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      console.error("Delete API error:", error);
      return {
        success: false,
        error: "Failed to delete recipe",
      };
    }
  },
};

export const contactAPI = {
  sendMessage: async (contactData: {
    name: string;
    email: string;
    message: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to send message",
      };
    }
  },
};

export const reviewsAPI = {
  getReviews: async (recipeId?: string): Promise<ApiResponse> => {
    try {
      console.log("reviewsAPI.getReviews called with recipeId:", recipeId);
      
      if (!recipeId || recipeId === "undefined") {
        console.error("Invalid recipe ID provided:", recipeId);
        return {
          success: false,
          error: "Recipe ID is required and cannot be undefined",
        };
      }

      console.log("Making request to:", `${API_BASE_URL}/reviews/${recipeId}`);
      const response = await fetch(`${API_BASE_URL}/reviews/${recipeId}`, {
        credentials: "include",
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      console.error("reviewsAPI.getReviews error:", error);
      return {
        success: false,
        error: "Failed to fetch reviews",
      };
    }
  },

  createReview: async (reviewData: {
    recipeId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse> => {
    try {
      const { recipeId, ...bodyData } = reviewData;
      const response = await fetch(`${API_BASE_URL}/reviews/${recipeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create review",
      };
    }
  },
};
