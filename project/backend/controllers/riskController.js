const RiskProfile = require("../models/RiskProfile");
const Conversation = require("../models/Conversation");
const { computeRiskScore, categorize } = require("../services/RiskEngine");
const { extractProfileInfo } = require("../services/GeminiService");

// GET /api/plan/risk-profile  -> used by Progress Sidebar + Dashboard
const getRiskProfile = async (req, res) => {
  try {
    const profile = await RiskProfile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Risk profile not found" });
    res.json({ riskProfile: profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch risk profile", error: err.message });
  }
};

/**
 * Internal helper (called from chatController after every message).
 * Pulls the full conversation, asks the LLM to extract structured fields,
 * merges them into RiskProfile, recomputes riskScore/category and
 * profileCompletion %, then returns the updated profile.
 */
const updateRiskProfileFromConversation = async (userId) => {
  const history = await Conversation.find({ userId }).sort({ createdAt: 1 });
  const extracted = await extractProfileInfo(history);

  let profile = await RiskProfile.findOne({ userId });
  if (!profile) profile = await RiskProfile.create({ userId });

  if (extracted.goal) {
    profile.goals = Array.from(new Set([...(profile.goals || []), extracted.goal]));
    profile.extractedInfo.goal = extracted.goal;
  }
  if (extracted.age) profile.extractedInfo.age = extracted.age;
  if (extracted.income) profile.income = extracted.income;
  if (extracted.timeHorizonYears) profile.timeHorizonYears = extracted.timeHorizonYears;
  if (extracted.investmentExperience) profile.investmentExperience = extracted.investmentExperience;
  if (typeof extracted.hasEmergencyFund === "boolean") {
    profile.extractedInfo.hasEmergencyFund = extracted.hasEmergencyFund;
  }

  const riskScore = computeRiskScore({
    age: profile.extractedInfo.age,
    timeHorizonYears: profile.timeHorizonYears,
    riskAppetite: extracted.riskAppetite,
    emotionalTolerance: profile.emotionalTolerance,
    hasEmergencyFund: profile.extractedInfo.hasEmergencyFund,
  });

  profile.riskScore = riskScore;
  profile.riskCategory = categorize(riskScore);

  // Completion % — how many of the 6 key fields we now know
  const fields = [
    profile.extractedInfo.goal,
    profile.extractedInfo.age,
    profile.income,
    profile.timeHorizonYears,
    profile.extractedInfo.hasEmergencyFund !== null,
    profile.riskCategory !== "Unassessed",
  ];
  profile.profileCompletion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  await profile.save();
  return profile;
};

module.exports = { getRiskProfile, updateRiskProfileFromConversation };
