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
      const response = await fetch(`${API_BASE_URL}/posts`);
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
      const response = await fetch(`${API_BASE_URL}/recipes`);
      const data = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : null,
        message: data.message,
      };
    } catch (error) {
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
