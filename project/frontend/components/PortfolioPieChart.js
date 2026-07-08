"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  equity: "#1F5C5C",
  mutualFunds: "#5FB89C",
  etf: "#D98E4A",
  gold: "#E0A93E",
  debt: "#8B98A0",
};

const LABELS = {
  equity: "Stocks",
  mutualFunds: "Mutual Funds",
  etf: "ETF",
  gold: "Gold",
  debt: "Debt",
};

export default function PortfolioPieChart({ allocation }) {
  const data = Object.entries(allocation || {})
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({ name: LABELS[key] || key, key, value }));

  if (!data.length) {
    return <p className="text-sm text-mist/50">No allocation data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key] || "#1F5C5C"} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{ background: "#123238", border: "1px solid #1F5C5C", borderRadius: 8, color: "#CFE8E3" }}
        />
        <Legend wrapperStyle={{ color: "#CFE8E3", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
