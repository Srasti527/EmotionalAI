"use client";

const EMOTION_MAP = {
  calm: { emoji: "🙂", label: "Calm", color: "text-calm" },
  neutral: { emoji: "🙂", label: "Calm", color: "text-calm" },
  concerned: { emoji: "😟", label: "Concerned", color: "text-concern" },
  panic: { emoji: "😨", label: "Panic", color: "text-panic" },
  greedy: { emoji: "🤑", label: "Excited about returns", color: "text-concern" },
  excited: { emoji: "🤩", label: "Excited", color: "text-calm" },
};

export default function EmotionIndicator({ emotion = "neutral" }) {
  const info = EMOTION_MAP[emotion] || EMOTION_MAP.neutral;
  return (
    <div className="flex items-center gap-2 rounded-full bg-deep border border-teal/40 px-4 py-2">
      <span className="text-lg">{info.emoji}</span>
      <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
    </div>
  );
}
