const Conversation = require("../models/Conversation");
const RiskProfile = require("../models/RiskProfile");
const { deriveEmotionalTolerance } = require("../services/RiskEngine");

// GET /api/chat/emotion  -> latest emotional state indicator for the sidebar widget
const getCurrentEmotion = async (req, res) => {
  try {
    const last = await Conversation.findOne({ userId: req.userId, sender: "user" }).sort({
      createdAt: -1,
    });

    res.json({ emotion: last ? last.detectedEmotion : "neutral" });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emotional state", error: err.message });
  }
};

// Internal helper (used by chatController) — recalculates emotionalTolerance
// based on the last N detected emotions and updates the RiskProfile.
const recalculateEmotionalTolerance = async (userId) => {
  const recent = await Conversation.find({ userId, sender: "user" })
    .sort({ createdAt: -1 })
    .limit(8);

  const emotions = recent.map((c) => c.detectedEmotion);
  const tolerance = deriveEmotionalTolerance(emotions);

  await RiskProfile.findOneAndUpdate(
    { userId },
    { emotionalTolerance: tolerance, currentEmotionalState: emotions[0] || "neutral" },
    { upsert: true }
  );

  return tolerance;
};

module.exports = { getCurrentEmotion, recalculateEmotionalTolerance };
