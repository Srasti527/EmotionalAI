/**
 * MarketAPI.js
 * Stub/wrapper for an external market-data provider (e.g. NSE/AMFI/Alpha Vantage).
 * Replace getAssetClassReturns with a real API call (via axios) when available.
 */
const axios = require("axios");

// Static fallback assumptions (annualised, %) used until a live data source is wired in.
const DEFAULT_RETURNS = {
  equity: 12,
  mutualFunds: 11,
  etf: 10,
  gold: 8,
  debt: 6.5,
};

async function getAssetClassReturns() {
  // Example of how a real integration would look:
  // const { data } = await axios.get(process.env.MARKET_API_URL);
  // return mapToAssetClasses(data);
  return DEFAULT_RETURNS;
}

function blendedExpectedReturn(allocationPercent, returns = DEFAULT_RETURNS) {
  let weighted = 0;
  for (const [asset, pct] of Object.entries(allocationPercent)) {
    weighted += ((returns[asset] || 0) * pct) / 100;
  }
  return Math.round(weighted * 100) / 100;
}

module.exports = { getAssetClassReturns, blendedExpectedReturn, DEFAULT_RETURNS };
