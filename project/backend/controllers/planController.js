const InvestmentPlan = require("../models/InvestmentPlan");
const RiskProfile = require("../models/RiskProfile");
const { blendedExpectedReturn, getAssetClassReturns } = require("../services/MarketAPI");

// Allocation templates per risk category (Pie Chart data)
const ALLOCATION_TEMPLATES = {
  Conservative: { equity: 15, mutualFunds: 20, etf: 10, gold: 20, debt: 35 },
  Moderate: { equity: 40, mutualFunds: 30, etf: 20, gold: 10, debt: 0 },
  Aggressive: { equity: 60, mutualFunds: 25, etf: 15, gold: 0, debt: 0 },
};

function buildMilestones(monthlyInvestment, annualReturnPercent, years) {
  const milestones = [];
  const monthlyRate = annualReturnPercent / 100 / 12;
  const startYear = new Date().getFullYear();
  const checkpoints = [Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years];

  checkpoints.forEach((yr) => {
    if (yr <= 0) return;
    const n = yr * 12;
    // Future value of a growing SIP (approx, ignoring yearly step-up for simplicity here)
    const fv =
      monthlyRate === 0
        ? monthlyInvestment * n
        : monthlyInvestment * (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate));

    milestones.push({
      year: startYear + yr,
      label: `${yr} year${yr > 1 ? "s" : ""}`,
      projectedValue: Math.round(fv),
    });
  });

  return milestones;
}

// POST /api/plan/generate  -> generateInvestmentPlan()
const generateInvestmentPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await RiskProfile.findOne({ userId });

    if (!profile || profile.profileCompletion < 60) {
      return res.status(400).json({
        message: "Not enough information yet to generate a plan. Keep chatting with the advisor.",
        profileCompletion: profile ? profile.profileCompletion : 0,
      });
    }

    const allocation = ALLOCATION_TEMPLATES[profile.riskCategory] || ALLOCATION_TEMPLATES.Moderate;
    const returns = await getAssetClassReturns();
    const expectedReturn = blendedExpectedReturn(allocation, returns);

    const income = profile.income || 600000; // fallback annual income (INR)
    // Simple heuristic: recommend investing ~20% of monthly income, floor at 2000
    const monthlyInvestment = Math.max(2000, Math.round((income / 12) * 0.2));

    const horizon = profile.timeHorizonYears || 10;
    const milestones = buildMilestones(monthlyInvestment, expectedReturn, horizon);
    const estimatedCorpus = milestones.length ? milestones[milestones.length - 1].projectedValue : 0;

    const suggestions = [
      "Increase your SIP by 5% every year as your income grows",
      "Maintain at least 6 months of expenses as an emergency fund",
      "Review your portfolio allocation once a year",
    ];
    if (profile.riskCategory === "Aggressive") {
      suggestions.push("Rebalance towards debt as you get closer to your goal");
    }
    if (profile.emotionalTolerance === "Low") {
      suggestions.push("Avoid checking your portfolio daily during market volatility");
    }

    const plan = await InvestmentPlan.findOneAndUpdate(
      { userId },
      {
        userId,
        allocation,
        expectedReturn,
        monthlyInvestment,
        yearlyIncreasePercent: 5,
        estimatedCorpus,
        goal: profile.extractedInfo?.goal || profile.goals?.[0] || "Wealth creation",
        milestones,
        suggestions,
      },
      { upsert: true, new: true }
    );

    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate investment plan", error: err.message });
  }
};

// GET /api/plan
const getPlan = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findOne({ userId: req.userId });
    if (!plan) return res.status(404).json({ message: "No investment plan found yet" });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plan", error: err.message });
  }
};

module.exports = { generateInvestmentPlan, getPlan };
