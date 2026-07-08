"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-mist mb-1">Welcome back</h1>
        <p className="text-sm text-mist/60 mb-8">Sign in to continue your plan.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-mist/60 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-mist/60 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-panic text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-ink font-medium rounded-full py-2.5 hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-mist/60 mt-6 text-center">
          New here?{" "}
          <Link href="/signup" className="text-amber hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}