import axios from "axios";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1401812483026587720/HDyLZaWFSWnapF-V0nnsEOD-t6RdlvoWjpkneiSOOrpVM8H5ccKVOriB4UzcaZBWhgAI";
const USER_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1401840634914013274/6gqxv1PkKzs49d_liGIxWXAaB90L-Gg05nIXfBZqtjf7dpwuUenmovkWUfZNRtuvRrI_";
const RECIPE_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1401841145725587496/OC2DKwa4mBIWV6gK8x05f1hn37uwnRb9NLYEMdW-yY4ryc7HxN4JdbUe-Rt1XZtuHEQX";
const REVIEW_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1401841331541901454/qpgAP9uOFzN6sH6Jl7CBNfdEzzWSRHfq2cBt21Lrp6v_XNMMI3KvBdz54APeecFAL-ZN";
const CONTAC_US_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1401841542846611456/85gbMWbMulhiZTn6y1JujJNtLy-YsTWoG1c24weOpWXSgAHMbz7eGcazyyS5ckj9YSaG";

const DiscordHandler = {
  async userToDiscord(userName: string) {
    console.log("entered user func");

    const contentString = `new user created! `;
    try {
      await axios.post(`${USER_WEBHOOK_URL}`, {
        content: "new member update",
        embeds: [
          {
            title: contentString,
            description: `${userName} joined out recipe community! \n welcome ${userName} we are glad to welcome you here`,
            color: 3447003,
          },
        ],
      });
      console.log("disored user posted");
    } catch (error) {
      console.log("_userToDiscord Error:");
      console.log(error);
      return new Error("something went erong");
    }
  },
  async recipeToDiscord(
    status: "new" | "update" | "delete",
    title: string,
    userName: string
  ) {
    console.log("entered discord recipe func");

    let contentS = `recipe update`;
    let contentString = `${
      status === "new" ? "new recipe created by:" : "recipe edited! edited by:"
    } ${userName}`;
    let descriptionString =
      status == "new"
        ? `${userName} added : "${title}" to our recipe collection`
        : `${userName} edited his : "${title}" recipe in our  collection`;
    if (status === "delete") {
      contentS = `recipe deleted`;
      contentString = `recipe deleted by: ${userName}`;
      descriptionString = `${userName} recipe- "${title}" deleted!  `;
    }

    try {
      await axios.post(`${RECIPE_WEBHOOK_URL}`, {
        content: contentS,
        embeds: [
          {
            title: contentString,
            description: descriptionString,
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
  },
  async reviewToDiscord(
    status: "new" | "update",
    review: { rating: number; comment: string },
    userName: string
  ) {
    console.log("entered func");

    const contentString = `${
      status === "new" ? "new review created by:" : "review edited! edited by:"
    } ${userName}`;
    try {
      await axios.post(`${REVIEW_WEBHOOK_URL}`, {
        content: "review update",
        embeds: [
          {
            title: contentString,
            description: `rating: ${review.rating}\n comment: ${review.comment}`,
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
  },
  async contactUsToDiscord(userName: string, email: string, message: string) {
    console.log("entered func");

    try {
      await axios.post(`${CONTAC_US_WEBHOOK_URL}`, {
        content: `New Contact Us Message!`,
        embeds: [
          {
            title: `new message from: ${userName} `,
            description: `email: ${email}\n message: ${message}`,
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
  },
};

export default DiscordHandler;

// async function update(req: AuthRequest, res: Response) {
//   const user = await UserModel.findById(req.user!.userId);
//   const { postId } = req.params;

//   if (!postId) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   if (!user) {
//     return res.status(401).json({ message: "You must Be logged in" });
//   }

//   const { title, content } = req.body ?? {};

//   if (!title || !content) {
//     console.log("title", title);
//     console.log("content", content);
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     // const { username } = req.user;
//     const updatedPost = await postsModel.update(
//       postId,
//       { title, content },
//       user.id
//     );
//     // postsModel.postToDiscord("update", { title, content }, user.name);

//     return res
//       .status(200)
//       .json({ message: "Post updated successfully", updatedPost });
//   } catch (error) {
//     console.log(error);
//     if (error! instanceof Error) {
//       return res.status(500).json({ message: "unknown error" });
//     } else if (error instanceof Error) {
//       switch (error.name) {
//         case ERROR_NAMES.ERROR_POST_NOT_FOUND:
//           return res.status(404).json({ message: error.message });
//         case ERROR_NAMES.ERROR_USER_NOT_FOUND:
//           return res.status(401).json({ message: error.message });
//         case ERROR_NAMES.ERROR_UNAUTHORIZED:
//           return res.status(403).json({ message: error.message });
//         default:
//           return res.status(500).json({ message: "Something went wrong" });
//       }
//     }
//   }
// }
// async function remove(req: AuthRequest, res: Response) {
//   const user = await UserModel.findById(req.user!.userId);

//   const { postId } = req.params;

//   if (!postId) {
//     return res.status(404).json({ message: "Post not found" });
//   }
//   if (!user) {
//     return res.status(401).json({ message: "You must Be logged in" });
//   }

//   try {
//     const removedPost = await postsModel.remove(postId, user.id);
//     return res
//       .status(200)
//       .json({ message: "Post removed successfully", removedPost });
//   } catch (error) {
//     console.log(error);
//     if (error! instanceof Error) {
//       return res.status(500).json({ message: "unknown error" });
//     } else if (error instanceof Error) {
//       switch (error.name) {
//         case ERROR_NAMES.ERROR_POST_NOT_FOUND:
//           return res.status(404).json({ message: error.message });
//         case ERROR_NAMES.ERROR_USER_NOT_FOUND:
//           return res.status(401).json({ message: error.message });
//         case ERROR_NAMES.ERROR_UNAUTHORIZED:
//           return res.status(403).json({ message: error.message });
//         default:
//           return res.status(500).json({ message: "Something went wrong" });
//       }
//     }
//   }
// }
