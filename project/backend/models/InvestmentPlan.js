const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    label: { type: String },
    projectedValue: { type: Number },
  },
  { _id: false }
);

const investmentPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    allocation: {
      equity: { type: Number, default: 0 },
      mutualFunds: { type: Number, default: 0 },
      etf: { type: Number, default: 0 },
      gold: { type: Number, default: 0 },
      debt: { type: Number, default: 0 },
    },
    expectedReturn: { type: Number },
    monthlyInvestment: { type: Number },
    yearlyIncreasePercent: { type: Number, default: 5 },
    estimatedCorpus: { type: Number },
    goal: { type: String },
    milestones: [milestoneSchema],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvestmentPlan", investmentPlanSchema);
