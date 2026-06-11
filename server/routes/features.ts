import { Router, Response } from "express";
import { Db, QuizEntity, ChatEntity, ChatMessage } from "../db";
import { authenticateToken, AuthenticatedRequest } from "./middleware";

const router = Router();

// GET /api/features/quiz
router.get("/quiz", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = Db.read();
  const quiz = db.quizzes.find(q => q.userId === req.userId);
  if (!quiz) {
    return res.json({ skinProfile: null });
  }
  res.json({ skinProfile: quiz.skinProfile });
});

// POST /api/features/quiz
router.post("/quiz", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { skinProfile } = req.body;

  if (!skinProfile) {
    return res.status(400).json({ error: "Missing skin profile payload" });
  }

  const db = Db.read();
  const quizIndex = db.quizzes.findIndex(q => q.userId === req.userId);

  if (quizIndex !== -1) {
    db.quizzes[quizIndex].skinProfile = skinProfile;
  } else {
    db.quizzes.push({ userId: req.userId!, skinProfile });
  }

  Db.write(db);
  res.json({ success: true, skinProfile });
});

// GET /api/features/chat
router.get("/chat", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = Db.read();
  let chat = db.chats.find(c => c.userId === req.userId);

  if (!chat) {
    // Initialize default chat for new user
    chat = {
      id: Date.now().toString(),
      userId: req.userId!,
      messages: [
        {
          id: "m1",
          sender: "doctor",
          text: "Hello! I am Dr. Sara, your SkinScan AI companion. How can I help you manage your skin health today?",
          timestamp: new Date().toISOString()
        }
      ]
    };
    db.chats.push(chat);
    Db.write(db);
  }

  res.json(chat.messages);
});

// POST /api/features/chat
router.post("/chat", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text payload" });
  }

  const db = Db.read();
  let chatIndex = db.chats.findIndex(c => c.userId === req.userId);

  if (chatIndex === -1) {
    const newChat: ChatEntity = {
      id: Date.now().toString(),
      userId: req.userId!,
      messages: [
        {
          id: "m1",
          sender: "doctor",
          text: "Hello! I am Dr. Sara, your SkinScan AI companion. How can I help you manage your skin health today?",
          timestamp: new Date().toISOString()
        }
      ]
    };
    db.chats.push(newChat);
    Db.write(db);
    chatIndex = db.chats.length - 1;
  }

  const chat = db.chats[chatIndex];

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    sender: "user",
    text,
    timestamp: new Date().toISOString(),
  };

  chat.messages.push(userMessage);

  // Generate automated clinical AI response simulator
  const lowerText = text.toLowerCase();
  let replyText = "Thank you for sharing that. I highly recommend taking a focused image scan of the affected skin area using our built-in scan tools to allow me to better understand the severity and direct you to the right care.";

  if (lowerText.includes("mole") || lowerText.includes("spot") || lowerText.includes("dark")) {
    replyText = "Changes in moles (color asymmetry, irregular borders, or growing size) should be monitored closely. Please use our 'Start New Scan' tool to analyze the spot and track its timeline.";
  } else if (lowerText.includes("itch") || lowerText.includes("rash") || lowerText.includes("dry") || lowerText.includes("red")) {
    replyText = "Dry, itchy, or red patches are common symptoms of eczema or psoriasis. I recommend staying hydrated, applying a mild fragrance-free moisturizer, and scheduling a quick scan through our app so we can evaluate it.";
  } else if (lowerText.includes("sun") || lowerText.includes("burn") || lowerText.includes("uv")) {
    replyText = "Sunburn and high UV exposure increase long-term risk. Be sure to check our 'Weather Correlation' module for today's local UV risks and apply SPF 30+ every 2 hours!";
  } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
    replyText = "Hello! I am here to help. Are you noticing any unusual changes on your skin, or do you have general questions about skin types and skincare routines?";
  }

  const doctorMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    sender: "doctor",
    text: replyText,
    timestamp: new Date().toISOString(),
  };

  chat.messages.push(doctorMessage);
  Db.write(db);

  res.json({
    userMessage,
    doctorMessage
  });
});

export default router;
