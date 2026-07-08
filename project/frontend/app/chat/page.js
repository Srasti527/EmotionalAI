"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { chatApi, planApi, authApi } from "../../lib/api";
import ChatBubble from "../../components/ChatBubble";
import EmotionIndicator from "../../components/EmotionIndicator";
import ProgressSidebar from "../../components/ProgressSidebar";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [riskProfile, setRiskProfile] = useState(null);
  const bottomRef = useRef(null);
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
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const { data } = await chatApi.getHistory();
      if (data.history.length) {
        setMessages(data.history);
      } else {
        setMessages([
          {
            sender: "ai",
            message: `Hi ${userName || "there"} 👋 What brings you here today?`,
          },
        ]);
      }
      const riskRes = await planApi.getRiskProfile().catch(() => null);
      if (riskRes) setRiskProfile(riskRes.data.riskProfile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { sender: "user", message: text }]);
    setInput("");
    setSending(true);

    try {
      const { data } = await chatApi.sendMessage(text);
      setMessages((prev) => [...prev, data.aiMessage]);
      setEmotion(data.detectedEmotion);
      setRiskProfile(data.riskProfile);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: "Sorry, something went wrong reaching the advisor. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-6xl mx-auto">
      <section className="flex-1 flex flex-col bg-deep/40 border border-teal/30 rounded-xl2 overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 border-b border-teal/20">
          <h1 className="font-display text-lg">AI Advisor</h1>
          <div className="flex items-center gap-3">
            <EmotionIndicator emotion={emotion} />
            <button
              onClick={handleLogout}
              className="text-xs text-mist/50 hover:text-amber transition-colors border border-teal/30 rounded-full px-3 py-1.5"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((m, i) => (
            <ChatBubble key={m._id || i} sender={m.sender} message={m.message} />
          ))}
          {sending && (
            <ChatBubble sender="ai" message="Thinking..." />
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-teal/20 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-ink border border-teal/40 px-5 py-2.5 text-sm outline-none focus:border-amber"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-amber text-ink font-medium px-6 py-2.5 rounded-full hover:brightness-110 transition disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </section>

      <ProgressSidebar riskProfile={riskProfile} />
    </main>
  );
}