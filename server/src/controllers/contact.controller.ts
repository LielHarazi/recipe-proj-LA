import { Request, Response } from "express";
import ContactModel from "../models/Contact.model";
import { validateEmail } from "../middleware/validation";
import DiscordHandler from "../discord/discird.handler";

const ContactController = {
  async leaveAMessage(req: Request, res: Response): Promise<void> {
    try {
      const { email, message, name } = req.body;

      // Check required fields
      if (!email || !message || !name) {
        res
          .status(400)
          .json({ message: "All fields (email, password, name) are required" });
        return;
      }

      // Validate email format
      if (!validateEmail(email)) {
        res
          .status(400)
          .json({ message: "Please provide a valid email address" });
        return;
      }

      // Validate name length
      if (name.trim().length < 2) {
        res
          .status(400)
          .json({ message: "Name must be at least 2 characters long" });
        return;
      }
      if (message.trim().length < 5) {
        res
          .status(400)
          .json({ message: "Message must be at least 5 characters long" });
        return;
      }
      const contactMessage = await ContactModel.create({
        email,
        name,
        message,
      });
      DiscordHandler.contactUsToDiscord(name, email, message);
      res.status(201).json({
        success: true,
        data: contactMessage,
      });
    } catch (error) {
      console.error("creating contact request error:", error);
      res.status(500).json({
        message: "Server error during creating contact request",
        error,
      });
    }
  },
};
export default ContactController;
