"use client";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-teal/20 last:border-0">
      <span className="text-xs text-mist/60">{label}</span>
      <span className="text-sm text-mist font-medium">
        {value ? `✔ ${value}` : <span className="text-mist/30">—</span>}
      </span>
    </div>
  );
}

export default function ProgressSidebar({ riskProfile }) {
  const goal = riskProfile?.extractedInfo?.goal || riskProfile?.goals?.[0];
  const income = riskProfile?.income ? `₹${(riskProfile.income / 100000).toFixed(0)} LPA` : null;
  const risk = riskProfile?.riskCategory !== "Unassessed" ? riskProfile?.riskCategory : null;
  const emergencyFund =
    riskProfile?.extractedInfo?.hasEmergencyFund === true
      ? "Yes"
      : riskProfile?.extractedInfo?.hasEmergencyFund === false
      ? "No"
      : null;
  const horizon = riskProfile?.timeHorizonYears ? `${riskProfile.timeHorizonYears} Years` : null;
  const completion = riskProfile?.profileCompletion || 0;

  return (
    <aside className="w-full md:w-72 bg-deep/60 border border-teal/30 rounded-xl2 p-5">
      <h3 className="text-sm font-semibold text-mist mb-3">Your profile</h3>

      <Row label="Goal" value={goal} />
      <Row label="Income" value={income} />
      <Row label="Risk" value={risk} />
      <Row label="Emergency Fund" value={emergencyFund} />
      <Row label="Investment Horizon" value={horizon} />

      <div className="mt-4">
        <div className="flex justify-between text-xs text-mist/60 mb-1">
          <span>Completion</span>
          <span>{completion}%</span>
        </div>
        <div className="h-2 rounded-full bg-ink overflow-hidden">
          <div
            className="h-full bg-amber transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
