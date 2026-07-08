"use client";

export default function PlanCard({ plan }) {
  if (!plan) return null;

  return (
    <div className="bg-paper text-ink rounded-xl2 p-6">
      <p className="text-xs uppercase tracking-wide text-teal font-medium mb-1">Your Goal</p>
      <h3 className="font-display text-xl mb-5">{plan.goal}</h3>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <p className="text-xs text-ink/50">Monthly Investment</p>
          <p className="font-semibold text-lg">₹{plan.monthlyInvestment?.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50">Expected Returns</p>
          <p className="font-semibold text-lg">{plan.expectedReturn}%</p>
        </div>
        <div>
          <p className="text-xs text-ink/50">Estimated Corpus</p>
          <p className="font-semibold text-lg">
            ₹{(plan.estimatedCorpus / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-wide text-teal font-medium mb-2">Suggestions</p>
      <ul className="space-y-1.5">
        {(plan.suggestions || []).map((s, i) => (
          <li key={i} className="text-sm text-ink/80">• {s}</li>
        ))}
      </ul>
    </div>
  );
}
