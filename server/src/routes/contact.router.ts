import express from "express";

const router = express.Router();

// POST /api/contact - Send contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // For now, just log the message - replace with actual email service
    console.log("Contact message received:", { name, email, message });

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

export default router;
