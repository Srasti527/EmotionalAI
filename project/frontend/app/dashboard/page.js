"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { planApi, authApi } from "../../lib/api";
import PortfolioPieChart from "../../components/PortfolioPieChart";
import GrowthLineChart from "../../components/GrowthLineChart";
import PlanCard from "../../components/PlanCard";

export default function DashboardPage() {
  const router = useRouter();
  const [riskProfile, setRiskProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName = (() => {
    if (typeof window === "undefined") return "";
    try {
      return JSON.parse(localStorage.getItem("user"))?.name?.split(" ")[0] || "";
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    load();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const riskRes = await planApi.getRiskProfile();
      setRiskProfile(riskRes.data.riskProfile);

      let planRes;
      try {
        planRes = await planApi.getPlan();
      } catch {
        planRes = await planApi.generatePlan();
      }
      setPlan(planRes.data.plan);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your dashboard yet. Keep chatting with the advisor first.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-mist/60">Loading your dashboard...</main>;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Welcome {userName || "back"}</h1>
          {riskProfile && (
            <p className="text-mist/60 text-sm mt-1">
              Your Risk Score <span className="text-amber font-semibold">{riskProfile.riskScore}/100</span> ·{" "}
              {riskProfile.riskCategory} Investor
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="text-xs text-mist/50 hover:text-amber transition-colors border border-teal/30 rounded-full px-3 py-1.5"
          >
            Back to chat
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-mist/50 hover:text-amber transition-colors border border-teal/30 rounded-full px-3 py-1.5"
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-deep border border-teal/30 rounded-xl2 p-6 text-mist/70 text-sm">
          {error}
        </div>
      )}

      {plan && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-deep/40 border border-teal/30 rounded-xl2 p-5">
            <h2 className="font-display text-lg mb-2">Portfolio</h2>
            <PortfolioPieChart allocation={plan.allocation} />
          </div>

          <div className="bg-deep/40 border border-teal/30 rounded-xl2 p-5">
            <h2 className="font-display text-lg mb-2">Investment Timeline</h2>
            <GrowthLineChart milestones={plan.milestones} />
          </div>

          <div className="md:col-span-2">
            <PlanCard plan={plan} />
          </div>
        </div>
      )}
    </main>
  );
}