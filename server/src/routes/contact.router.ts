import express from "express";
import ContactController from "../controllers/contact.controller";

const router = express.Router();

// POST /api/contact - Send contact message
router.post("/", ContactController.leaveAMessage);

export default router;
