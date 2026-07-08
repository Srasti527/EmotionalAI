const Conversation = require("../models/Conversation");
const { getChatReply } = require("../services/GeminiService");
const { detectEmotion, getEmotionalCoachingNote } = require("../services/EmotionEngine");
const { updateRiskProfileFromConversation } = require("./riskController");
const { recalculateEmotionalTolerance } = require("./emotionController");

// POST /api/chat/message
// Step 1: receive message -> save -> call GPT -> save AI reply -> return
// Step 2/3: kick off background-ish profile + emotion updates
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    // Detect emotion on the incoming user message
    const detectedEmotion = detectEmotion(message);

    // Persist user message
    const userMsg = await Conversation.create({
      userId,
      sender: "user",
      message,
      detectedEmotion,
    });

    // Pull history (excluding the message we just saved, for prompt construction)
    const history = await Conversation.find({ userId }).sort({ createdAt: 1 });

    // Call the LLM
    let aiReplyText = await getChatReply(history.slice(0, -1), message);

    // Optionally prepend a calming/coaching note if emotion warrants it
    const coachingNote = getEmotionalCoachingNote(detectedEmotion);
    if (coachingNote) {
      aiReplyText = `${coachingNote} ${aiReplyText}`;
    }

    const aiMsg = await Conversation.create({
      userId,
      sender: "ai",
      message: aiReplyText,
      detectedEmotion: "neutral",
    });

    // Step 3: continuously update Risk Profile + Emotional Tolerance
    const [riskProfile, emotionalTolerance] = await Promise.all([
      updateRiskProfileFromConversation(userId),
      recalculateEmotionalTolerance(userId),
    ]);

    res.status(201).json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      detectedEmotion,
      riskProfile,
      emotionalTolerance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process message", error: err.message });
  }
};

// GET /api/chat/history
const getHistory = async (req, res) => {
  try {
    const history = await Conversation.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
};

module.exports = { sendMessage, getHistory };
