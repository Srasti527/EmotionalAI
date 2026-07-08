const axios = require("axios");

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are an empathetic AI investment advisor.
Your job is to have a warm, natural conversation with the user to learn:
- Their financial goal (retirement, house, education, wealth building, etc.)
- Their age and income
- Their investment horizon (in years)
- Their risk appetite and comfort with market volatility
- Whether they have an emergency fund
- Their emotional state about money and investing (calm, worried, panicked, excited, greedy)

Rules:
- Ask ONE question at a time, in a friendly, human tone.
- Never give specific stock/fund names or guaranteed return promises.
- If the user sounds anxious, panicked, or fearful, respond calmly and reassuringly before continuing.
- If the user sounds overly greedy or chasing unrealistic returns, gently bring them back to a rational, goal-based mindset.
- Keep responses concise (2-4 sentences).`;

async function callGemini(contents, systemInstruction, temperature = 0.7) {
  const { data } = await axios.post(
    API_URL,
    {
      ...(systemInstruction && { system_instruction: { parts: [{ text: systemInstruction }] } }),
      contents,
      generationConfig: { temperature, maxOutputTokens: 300 },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
    }
  );

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

async function getChatReply(history, newMessage) {
  const contents = [
    ...history.map((h) => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.message }],
    })),
    { role: "user", parts: [{ text: newMessage }] },
  ];

  return callGemini(contents, SYSTEM_PROMPT, 0.7);
}

async function extractProfileInfo(history) {
  const transcript = history.map((h) => `${h.sender}: ${h.message}`).join("\n");

  const extractionPrompt = `From the conversation below, extract any of the following fields you can confidently infer.
Respond ONLY with valid minified JSON, no markdown, no commentary.
Fields: goal (string|null), age (number|null), income (number|null, annual in INR),
timeHorizonYears (number|null), riskAppetite (one of "Conservative","Moderate","Aggressive"|null),
hasEmergencyFund (boolean|null), investmentExperience (one of "None","Beginner","Intermediate","Advanced"|null).

Conversation:
${transcript}`;

  try {
    const raw = await callGemini(
      [{ role: "user", parts: [{ text: extractionPrompt }] }],
      null,
      0
    );
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("extractProfileInfo parse error:", err.message);
    return {};
  }
}

module.exports = { getChatReply, extractProfileInfo };