"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

const suggestedQuestions = [
  "Which schemes am I eligible for as a farmer?",
  "What documents do I need for PM-KISAN?",
  "How much is the Ayushman Bharat health cover?",
  "Are there any schemes for women entrepreneurs?",
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "Namaste! 🙏 I'm your Yojana Saarthi AI assistant. I can help you:\n\n• Find schemes you qualify for\n• Explain eligibility criteria\n• Tell you which documents you need\n• Draft application summaries\n\nWhat would you like to know?",
    timestamp: new Date(),
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response (TODO: wire to backend /api/chat)
    await new Promise((r) => setTimeout(r, 1200));
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: "Based on your profile, I found relevant information for your query. Here's a summary:\n\n**PM-KISAN Samman Nidhi** provides ₹6,000/year to eligible farmer families. You meet the landholding requirement (1.5 acres) and income criteria.\n\n📋 **Documents you have:** Aadhaar, Ration Card, Caste Certificate\n⚠️ **Missing:** Income Certificate\n\nWould you like me to show you how to get an income certificate, or draft an application?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold text-navy-900">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("•")) return <p key={i} className="pl-2">{line}</p>;
      if (line.startsWith("📋") || line.startsWith("⚠️")) return <p key={i} className="mt-1">{line}</p>;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10z" /></svg>
            </div>
            <div>
              <h1 className="font-bold text-navy-900 text-sm">Yojana Saarthi AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-slate-500">Online · Deterministic rules engine</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm"
                  : "bg-navy-900 text-white"
              }`}>
                {msg.role === "assistant" ? "YS" : "AD"}
              </div>
              {/* Bubble */}
              <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 space-y-1 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white border border-slate-100 shadow-sm text-slate-700"
                  : "bg-navy-900 text-white rounded-tr-sm"
              }`}>
                {formatText(msg.text)}
                <div className={`text-xs mt-2 ${msg.role === "assistant" ? "text-slate-400" : "text-white/50"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">YS</div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl px-5 py-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="max-w-4xl mx-auto w-full px-4 mb-4">
          <p className="text-xs text-slate-400 font-medium mb-2 px-1">Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50 text-slate-600 hover:text-orange-600 px-3 py-2 rounded-full transition-all font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about schemes, eligibility, documents…"
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-navy-900 text-sm placeholder-slate-400 max-h-32"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all shadow-sm shadow-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19V5m-7 7l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">AI provides guidance only · Always verify with official portals</p>
        </div>
      </div>
    </div>
  );
}
