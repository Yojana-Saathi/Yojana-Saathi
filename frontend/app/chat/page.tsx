"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage, type ChatMessage } from "@/lib/api";

const suggestions = [
  "What is PM-KISAN and who is eligible?",
  "How do I apply for Ayushman Bharat?",
  "What documents do I need for a caste certificate?",
  "Can I get multiple scheme benefits at once?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me anything about government welfare schemes — eligibility, documents, application steps, or deadlines.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const updated: ChatMessage[] = [...messages, { role: "user", content: userMsg }];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await sendChatMessage(userMsg, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please make sure the backend is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isSignedIn={false} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
          {/* Header */}
          <div className="pb-4 pt-6">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-navy sm:text-3xl">
              Scheme Q&A
            </h1>
            <p className="mt-1 text-sm text-slate-blue">
              Ask about any scheme — eligibility, documents, and how to apply.
            </p>
          </div>

          {/* Suggestions — shown when only the greeting exists */}
          {messages.length === 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border border-ink-navy/10 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-blue transition-colors hover:border-signal-orange/30 hover:text-signal-orange"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-ink-navy text-white"
                      : "border border-ink-navy/10 bg-white text-ink-navy"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-signal-orange/10 text-signal-orange">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-slate-blue-400">Scheme Q&A</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-ink-navy/10 bg-white px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-blue-300" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-blue-300" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-blue-300" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar — pinned to bottom */}
        <div className="border-t border-ink-navy/10 bg-warm-paper">
          <div className="mx-auto max-w-3xl px-4 pb-4 pt-4 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any scheme..."
                className="flex-1 rounded-xl border-2 border-ink-navy/10 bg-white px-4 py-3 text-sm text-ink-navy placeholder:text-slate-blue-300 focus:border-signal-orange focus:outline-none"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <p className="mt-2 text-xs text-slate-blue-400">
              Answers are generated from live scheme data. Results may vary — verify with official sources.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
