const mongoose = require("mongoose");

const riskProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    riskCategory: {
      type: String,
      enum: ["Conservative", "Moderate", "Aggressive", "Unassessed"],
      default: "Unassessed",
    },
    goals: [{ type: String }],
    income: { type: Number },
    investmentExperience: {
      type: String,
      enum: ["None", "Beginner", "Intermediate", "Advanced"],
      default: "None",
    },
    timeHorizonYears: { type: Number },
    emotionalTolerance: {
      type: String,
      enum: ["Low", "Medium", "High", "Unassessed"],
      default: "Unassessed",
    },
    currentEmotionalState: {
      type: String,
      enum: ["calm", "concerned", "panic", "excited", "neutral", "greedy"],
      default: "neutral",
    },
    profileCompletion: { type: Number, min: 0, max: 100, default: 0 },
    extractedInfo: {
      goal: String,
      age: Number,
      hasEmergencyFund: { type: Boolean, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskProfile", riskProfileSchema);
