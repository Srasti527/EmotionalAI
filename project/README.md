# Emotional AI Investment Advisor — Conversational Planner

Full-stack reference implementation: empathetic LLM advisor that chats with the user,
profiles their risk/goals/emotional state, and generates a personalised investment plan.

## Structure

```
project/
├── backend/        Node.js + Express + MongoDB API
└── frontend/       Next.js + Tailwind + Recharts UI
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm run dev               # nodemon, http://localhost:5000
```

### API endpoints

| Method | Route                    | Description                                  |
|--------|---------------------------|-----------------------------------------------|
| POST   | /api/auth/signup           | Register user, returns JWT                   |
| POST   | /api/auth/login            | Login, returns JWT                            |
| GET    | /api/auth/me               | Current user (auth required)                  |
| POST   | /api/chat/message           | Send a chat message, get AI reply + profile update |
| GET    | /api/chat/history           | Full conversation history                     |
| GET    | /api/chat/emotion           | Latest detected emotional state                |
| GET    | /api/plan/risk-profile      | Current risk profile                           |
| POST   | /api/plan/generate          | Generate / refresh investment plan             |
| GET    | /api/plan                   | Fetch saved investment plan                     |

## Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                         # http://localhost:3000
```

### Pages

- `/` — Landing page
- `/login`, `/signup` — Auth
- `/chat` — Main ChatGPT-style conversational advisor, with live Progress Sidebar
  and Emotional State Indicator
- `/dashboard` — Risk score, portfolio pie chart, growth line chart, AI-generated plan card

## Database (MongoDB collections)

- **Users** — name, email, password (hashed), age, occupation
- **Conversations** — userId, sender, message, detectedEmotion, timestamp
- **RiskProfile** — userId, riskScore, riskCategory, goals, income, investmentExperience,
  timeHorizonYears, emotionalTolerance, profileCompletion
- **InvestmentPlan** — userId, allocation, expectedReturn, monthlyInvestment,
  yearlyIncreasePercent, estimatedCorpus, milestones, suggestions

## Flow

1. User sends a message → saved → sent to OpenAI → AI reply saved → returned to client.
2. Backend asks the LLM to extract structured fields (goal, age, income, horizon, risk
   appetite, emergency fund) from the full conversation each turn.
3. `RiskEngine` recomputes `riskScore` / `riskCategory`; `EmotionEngine` + recent message
   history recompute `emotionalTolerance` and the live emotion indicator.
4. Once `profileCompletion >= 60%`, `/api/plan/generate` builds a SIP amount, asset
   allocation, blended expected return, and growth milestones for the dashboard.

## Notes

- Swap `services/OpenAIService.js` for the Gemini API by changing the client/SDK calls —
  the rest of the app is provider-agnostic since it only consumes `getChatReply` /
  `extractProfileInfo`.
- `services/MarketAPI.js` currently returns static assumed annual returns per asset class;
  replace with a live data provider when available.
- This is a portfolio/learning project, not registered investment advice.
