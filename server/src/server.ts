import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.router";
import reviewRoutes from "./routes/reviews.router";
import recipeRouter from "./routes/recipe.router";
import postsRouter from "./routes/posts.router";
import contactRouter from "./routes/contact.router";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/posts", postsRouter);
app.use("/api/contact", contactRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
});
