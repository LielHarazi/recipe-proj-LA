import express from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.mid";

const router = express.Router();

// GET /api/posts - Get all posts (including reviews)
router.get("/", async (req, res) => {
  try {
    // For now, return mock data - replace with actual database query
    const mockPosts = [
      {
        id: "1",
        title: "Welcome to L&H Recipe!",
        content:
          "Discover amazing recipes from talented chefs around the world.",
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
    ];

    res.json({
      success: true,
      data: {
        posts: mockPosts,
        users: [],
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
});

// POST /api/posts - Create new post (protected route)
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // For now, just return success - replace with actual database insert
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      category,
      author: {
        id: req.user.userId.toString(),
        name: req.user.email.split("@")[0], // Use email prefix as name for now
        role: "User",
        avatar: `https://ui-avatars.com/api/?name=${
          req.user.email.split("@")[0]
        }&background=random`,
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      featured: false,
    };

    res.status(201).json({
      success: true,
      data: newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
});

export default router;
