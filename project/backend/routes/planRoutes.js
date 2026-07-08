const express = require("express");
const { generateInvestmentPlan, getPlan } = require("../controllers/planController");
const { getRiskProfile } = require("../controllers/riskController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/risk-profile", getRiskProfile);
router.post("/generate", generateInvestmentPlan);
router.get("/", getPlan);

module.exports = router;
