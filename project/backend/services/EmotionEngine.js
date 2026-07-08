/**
 * EmotionEngine.js
 * Lightweight keyword/heuristic-based emotion detector for chat messages.
 * Used as a fast, deterministic fallback/complement to LLM-based sentiment.
 */

const EMOTION_KEYWORDS = {
  panic: ["crash", "lost everything", "scared", "terrified", "panic", "sell everything", "withdraw all", "emergency", "afraid"],
  concerned: ["worried", "nervous", "unsure", "risky", "not sure", "confused", "anxious", "concern"],
  greedy: ["double my money", "get rich", "guaranteed return", "quick profit", "10x", "huge returns", "fast money"],
  excited: ["excited", "pumped", "can't wait", "thrilled", "looking forward"],
  calm: ["fine", "comfortable", "okay with risk", "relaxed", "confident", "no worries"],
};

function detectEmotion(message) {
  const text = message.toLowerCase();

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) {
      return emotion;
    }
  }
  return "neutral";
}

/**
 * Returns a short, calming/contextual coaching note based on detected emotion.
 * Used by chatController to optionally prepend guidance before the AI's main reply.
 */
function getEmotionalCoachingNote(emotion) {
  switch (emotion) {
    case "panic":
      return "I can sense this feels overwhelming right now. Let's slow down — short-term market moves rarely change a long-term plan.";
    case "concerned":
      return "It's completely normal to feel unsure here. Let's take it one step at a time.";
    case "greedy":
      return "I understand wanting strong returns — let's make sure the plan stays realistic and sustainable.";
    default:
      return null;
  }
}

module.exports = { detectEmotion, getEmotionalCoachingNote };
