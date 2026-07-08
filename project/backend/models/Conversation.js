const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: String, enum: ["user", "ai"], required: true },
    message: { type: String, required: true },
    detectedEmotion: {
      type: String,
      enum: ["calm", "concerned", "panic", "excited", "neutral", "greedy"],
      default: "neutral",
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
