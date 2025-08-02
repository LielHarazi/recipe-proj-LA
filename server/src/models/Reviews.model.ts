import axios from "axios";
import { ERROR_NAMES } from "../middleware/errorHandler";
import { Post, IUser } from "../types";
import UserModel from "./User";
import { title } from "process";

/**
 {
    id: string,
    title: string,
    content: string,
    authorId: string,
    authorName: string,
    createdAt: Date,
    updatedAt: Date,
 }
 */
const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1398978982564593725/y2MI9K7jH27k1TmQo9GslhCNLpJBJSdcvF0xDgTPojObsCauuGLG8HneM57m9n1jIJ7A";

let posts: Post[] = [
  {
    id: "a1b2c3d4",
    title: "Introduction to React",
    content: "React is a JavaScript library for building user interfaces.",
    authorId: "101",
    authorName: "Alice Johnson",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-02T12:00:00Z"),
  },
  {
    id: "e5f6g7h8",
    title: "Understanding Node.js",
    content: "Node.js lets you run JavaScript on the server.",
    authorId: "102",
    authorName: "Bob Smith",
    createdAt: new Date("2024-01-05T09:30:00Z"),
    updatedAt: new Date("2024-01-06T15:00:00Z"),
  },
  {
    id: "i9j0k1l2",
    title: "Why TypeScript Matters",
    content: "TypeScript is a superset of JavaScript that adds types.",
    authorId: "103",
    authorName: "Charlie Davis",
    createdAt: new Date("2024-02-10T14:45:00Z"),
    updatedAt: new Date("2024-02-10T16:00:00Z"),
  },
  {
    id: "m3n4o5p6",
    title: "Exploring Express.js",
    content: "Express is a minimal and flexible Node.js web framework.",
    authorId: "104",
    authorName: "Diana Lee",
    createdAt: new Date("2024-03-02T11:20:00Z"),
    updatedAt: new Date("2024-03-03T08:00:00Z"),
  },
  {
    id: "q7r8s9t0",
    title: "REST vs GraphQL",
    content: "Compare RESTful APIs with GraphQL for frontend development.",
    authorId: "105",
    authorName: "Ethan Green",
    createdAt: new Date("2024-03-15T17:00:00Z"),
    updatedAt: new Date("2024-03-15T17:00:00Z"),
  },
  {
    id: "u1v2w3x4",
    title: "JavaScript Promises Explained",
    content:
      "Promises are used to handle asynchronous operations in JavaScript.",
    authorId: "106",
    authorName: "Fiona Brown",
    createdAt: new Date("2024-04-01T08:00:00Z"),
    updatedAt: new Date("2024-04-01T09:00:00Z"),
  },
  {
    id: "y5z6a7b8",
    title: "State Management with Redux",
    content: "Redux is a predictable state container for JavaScript apps.",
    authorId: "107",
    authorName: "George Miller",
    createdAt: new Date("2024-04-10T12:00:00Z"),
    updatedAt: new Date("2024-04-10T13:00:00Z"),
  },
  {
    id: "c9d0e1f2",
    title: "Using React Query",
    content: "React Query makes fetching, caching, and updating data easy.",
    authorId: "108",
    authorName: "Hannah Adams",
    createdAt: new Date("2024-05-01T10:30:00Z"),
    updatedAt: new Date("2024-05-01T11:00:00Z"),
  },
  {
    id: "g3h4i5j6",
    title: "Deploying with Vercel",
    content: "Vercel is a platform for frontend frameworks and static sites.",
    authorId: "109",
    authorName: "Ian Thompson",
    createdAt: new Date("2024-05-20T14:00:00Z"),
    updatedAt: new Date("2024-05-20T14:30:00Z"),
  },
  {
    id: "k7l8m9n0",
    title: "Intro to Docker for Devs",
    content:
      "Docker is a platform for building, shipping, and running apps in containers.",
    authorId: "110",
    authorName: "Jasmine Clark",
    createdAt: new Date("2024-06-01T09:00:00Z"),
    updatedAt: new Date("2024-06-01T10:00:00Z"),
  },
];
function getAll(filter: string) {
  return posts;
}

function getById(postId: string) {
  const post = posts.find((post) => post.id === postId);

  if (!post) {
    const error = new Error("Post not found");
    error.name = ERROR_NAMES.ERROR_POST_NOT_FOUND;
    throw error;
  }

  return post;
}
function create(postData: { title: string; content: string }, user: IUser) {
  //   const user = usersService.getByUsername(username);

  const newPost: Post = {
    ...postData,
    id: crypto.randomUUID().slice(0, 8),
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  posts.push(newPost);
  return newPost;
}
async function update(
  postId: string,
  postData: { title: string; content: string },
  userId: string
) {
  const post = getById(postId);
  const user = await UserModel.findById(userId);
  if (!user) return undefined;
  try {
    _checkOwnership(post.authorId, user.id); // this will throw or do nothing
  } catch (error) {
    console.log(error);
    return error;
  }

  const updatedPost: Post = { ...post, ...postData, updatedAt: new Date() };

  const idx = posts.indexOf(post);
  posts.splice(idx, 1);
  posts.push(updatedPost);

  return updatedPost;
}
function remove(postId: string, userId: string) {
  const post = getById(postId);
  if (!post) return new Error("Post Not Found");

  try {
    _checkOwnership(post.authorId, userId);
    posts = posts.filter((p) => p.id !== post.id);
  } catch (error) {
    console.log(error);
    return error;
  }
}

function _checkOwnership(authorId: string, userId: string) {
  console.log("entered funddddc");
  if (authorId !== userId) {
    const error = new Error("You are not the author of this post");
    error.name = ERROR_NAMES.ERROR_UNAUTHORIZED;
    throw error;
  }
}

async function postToDiscord(
  status: "new" | "update",
  newPost: { title: string; content: string },
  userName: string
) {
  console.log("entered func");

  const contentString = `${
    status === "new" ? "new post created by:" : "Post edited! edited by:"
  } ${userName}`;
  try {
    await axios.post(`${WEBHOOK_URL}`, {
      content: contentString,
      embeds: [
        {
          title: newPost.title,
          description: newPost.content,
          color: 3447003,
        },
      ],
    });
    console.log("disored posted");
  } catch (error) {
    console.log("_postToDiscord Error:");
    console.log(error);
    return new Error("something went erong");
  }
}

export const postsModel = {
  getAll,
  getById,
  create,
  update,
  remove,
  postToDiscord,
};
