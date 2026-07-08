"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthLineChart({ milestones }) {
  const data = (milestones || []).map((m) => ({
    year: m.year,
    value: m.projectedValue,
  }));

  if (!data.length) {
    return <p className="text-sm text-mist/50">No projection data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1F5C5C" strokeOpacity={0.2} vertical={false} />
        <XAxis dataKey="year" stroke="#CFE8E3" tick={{ fontSize: 12 }} />
        <YAxis
          stroke="#CFE8E3"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
        />
        <Tooltip
          formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Projected value"]}
          contentStyle={{ background: "#123238", border: "1px solid #1F5C5C", borderRadius: 8, color: "#CFE8E3" }}
        />
        <Line type="monotone" dataKey="value" stroke="#D98E4A" strokeWidth={3} dot={{ r: 4, fill: "#D98E4A" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
