"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const FEATURES = [
  { label: "Personalised", detail: "Plans built around your goals, not a template." },
  { label: "Emotion aware", detail: "Responds to how you feel, not just the numbers." },
  { label: "Goal based", detail: "Every suggestion ties back to what you're saving for." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(95,184,156,0.10),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(217,142,74,0.10),transparent_50%)]" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <span className="font-display text-lg tracking-wide text-mist">Aithra</span>
        <Link
          href="/login"
          className="text-sm text-mist/70 hover:text-amber transition-colors"
        >
          Sign in
        </Link>
      </header>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-amber text-sm font-medium tracking-[0.2em] uppercase mb-6"
        >
          AI Investment Advisor
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-3xl text-mist"
        >
          Let's build your<br /> financial future.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-lg text-mist/70"
        >
          A conversational advisor that listens for your goals and your worries,
          then turns both into a plan you can actually stick to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <Link
            href="/chat"
            className="mt-10 inline-block bg-amber text-ink font-medium px-8 py-3 rounded-full hover:brightness-110 transition"
          >
            Start Conversation
          </Link>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="rounded-xl2 border border-teal/40 bg-deep/60 px-5 py-5 text-left"
            >
              <p className="text-calm font-medium mb-1">✓ {f.label}</p>
              <p className="text-sm text-mist/60">{f.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 text-center text-xs text-mist/40 pb-6">
        Not financial advice. Always consult a registered advisor for major decisions.
      </footer>
    </main>
  );
}