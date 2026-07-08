"use client";

import { motion } from "framer-motion";

export default function ChatBubble({ sender, message }) {
  const isUser = sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-amber text-ink rounded-br-sm"
            : "bg-deep border border-teal/40 text-mist rounded-bl-sm"
        }`}
      >
        {!isUser && <p className="text-xs text-calm font-medium mb-1">AI</p>}
        {message}
      </div>
    </motion.div>
  );
}
