"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", occupation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      const { data } = await authApi.signup(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-mist mb-1">Create your account</h1>
        <p className="text-sm text-mist/60 mb-8">It takes less than a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-1/2 rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
            />
            <input
              placeholder="Occupation"
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              className="w-1/2 rounded-lg bg-deep border border-teal/40 px-4 py-2.5 text-mist outline-none focus:border-amber"
            />
          </div>

          {error && <p className="text-panic text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-ink font-medium rounded-full py-2.5 hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="text-sm text-mist/60 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-amber hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
