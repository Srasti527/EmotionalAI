/**
 * RiskEngine.js
 * Converts extracted profile info + emotional signals into a numeric risk score
 * and category, used to drive InvestmentPlan generation.
 */

function computeRiskScore({ age, timeHorizonYears, riskAppetite, emotionalTolerance, hasEmergencyFund }) {
  let score = 50;

  // Younger investors / longer horizons can typically absorb more risk
  if (age) {
    if (age < 30) score += 15;
    else if (age < 45) score += 5;
    else if (age < 55) score -= 5;
    else score -= 15;
  }

  if (timeHorizonYears) {
    if (timeHorizonYears >= 15) score += 15;
    else if (timeHorizonYears >= 7) score += 5;
    else if (timeHorizonYears >= 3) score -= 5;
    else score -= 15;
  }

  if (riskAppetite === "Aggressive") score += 15;
  if (riskAppetite === "Moderate") score += 0;
  if (riskAppetite === "Conservative") score -= 15;

  if (emotionalTolerance === "High") score += 10;
  if (emotionalTolerance === "Low") score -= 10;

  if (hasEmergencyFund === false) score -= 10; // no safety net -> recommend caution

  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

function categorize(score) {
  if (score >= 70) return "Aggressive";
  if (score >= 40) return "Moderate";
  return "Conservative";
}

function deriveEmotionalTolerance(recentEmotions = []) {
  const panicCount = recentEmotions.filter((e) => e === "panic").length;
  const concernedCount = recentEmotions.filter((e) => e === "concerned").length;

  if (panicCount >= 2) return "Low";
  if (panicCount + concernedCount >= 3) return "Low";
  if (recentEmotions.includes("calm") && panicCount === 0) return "High";
  return "Medium";
}

module.exports = { computeRiskScore, categorize, deriveEmotionalTolerance };
