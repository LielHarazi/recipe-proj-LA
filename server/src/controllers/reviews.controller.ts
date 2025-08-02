import { Request, Response } from "express";
import UserModel from "../models/User";
import { AuthRequest } from "../middleware/auth.mid";
import { postsModel } from "../models/Reviews.model";
import { ERROR_NAMES } from "../middleware/errorHandler";

function getAll(req: Request, res: Response) {
  //   const user = await UserModel.findById(req.user!.userId);
  const { filter } = req.query;
  const filterValue = typeof filter === "string" ? filter : "";

  //   console.log(req.user);
  //   console.log(user);
  //   res.status(200).json({ message: "success" });
  try {
    const posts = postsModel.getAll(filterValue);
    return res.status(200).json({ message: "Posts found", posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Somthing went wrong couldnt load posts" });
  }
}
function getById(req: AuthRequest, res: Response) {
  const { postId } = req.params;
  if (!postId) {
    return res.status(404).json({ message: "Post not found" });
  }

  try {
    const post = postsModel.getById(postId);
    return res.status(200).json({ message: "Post found", post });
  } catch (error) {
    console.log(error);
    if (error! instanceof Error) {
      return res.status(500).json({ message: "unknown error" });
    } else if (error instanceof Error) {
      switch (error.name) {
        case ERROR_NAMES.ERROR_POST_NOT_FOUND:
          return res.status(404).json({ message: "Post not found" });
        default:
          return res.status(500).json({ message: "Somthing went wrong" });
      }
    }
  }
}
async function create(req: AuthRequest, res: Response) {
  const { title, content } = req.body ?? {};
  const user = await UserModel.findById(req.user!.userId);

  if (!title || !content) {
    console.log("title", title);
    console.log("content", content);
    return res.status(400).json({ message: "Missing fields" });
  }
  if (!user) {
    return res.status(401).json({ message: "You must Be logged in" });
  }
  try {
    //   const { name } = req.user;
    const post = postsModel.create({ title, content }, user);
    postsModel.postToDiscord("new", { title, content }, user.name);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    if (error! instanceof Error) {
      return res.status(500).json({ message: "unknown error" });
    } else if (error instanceof Error) {
      switch (error.name) {
        case ERROR_NAMES.ERROR_USER_NOT_FOUND:
          return res.status(401).json({ message: "User not found" });
        default:
          return res.status(500).json({ message: "Somthing went wrong" });
      }
    }
  }
}

async function update(req: AuthRequest, res: Response) {
  const user = await UserModel.findById(req.user!.userId);
  const { postId } = req.params;

  if (!postId) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (!user) {
    return res.status(401).json({ message: "You must Be logged in" });
  }

  const { title, content } = req.body ?? {};

  if (!title || !content) {
    console.log("title", title);
    console.log("content", content);
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // const { username } = req.user;
    const updatedPost = await postsModel.update(
      postId,
      { title, content },
      user.id
    );
    postsModel.postToDiscord("update", { title, content }, user.name);

    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.log(error);
    if (error! instanceof Error) {
      return res.status(500).json({ message: "unknown error" });
    } else if (error instanceof Error) {
      switch (error.name) {
        case ERROR_NAMES.ERROR_POST_NOT_FOUND:
          return res.status(404).json({ message: error.message });
        case ERROR_NAMES.ERROR_USER_NOT_FOUND:
          return res.status(401).json({ message: error.message });
        case ERROR_NAMES.ERROR_UNAUTHORIZED:
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
}
async function remove(req: AuthRequest, res: Response) {
  const user = await UserModel.findById(req.user!.userId);

  const { postId } = req.params;

  if (!postId) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (!user) {
    return res.status(401).json({ message: "You must Be logged in" });
  }

  try {
    const removedPost = await postsModel.remove(postId, user.id);
    return res
      .status(200)
      .json({ message: "Post removed successfully", removedPost });
  } catch (error) {
    console.log(error);
    if (error! instanceof Error) {
      return res.status(500).json({ message: "unknown error" });
    } else if (error instanceof Error) {
      switch (error.name) {
        case ERROR_NAMES.ERROR_POST_NOT_FOUND:
          return res.status(404).json({ message: error.message });
        case ERROR_NAMES.ERROR_USER_NOT_FOUND:
          return res.status(401).json({ message: error.message });
        case ERROR_NAMES.ERROR_UNAUTHORIZED:
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
}

export const postsController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
