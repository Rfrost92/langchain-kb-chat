"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [kbText, setKbText] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!kbText.trim() || !question.trim()) {
      setError("Please paste some text and enter a question.");
      return;
    }

    const userMessage: Message = { role: "user", content: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: kbText, question: userMessage.content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer ?? "No answer.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const charsCount = kbText.length;
  const charsLabel =
      charsCount === 0 ? "No text yet" : `${charsCount.toLocaleString()} chars`;

  return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        {/* subtle background gradient */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#14b8a633,_transparent_55%),radial-gradient(circle_at_bottom,_#6366f166,_transparent_55%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-8 md:px-8 md:pt-10">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                LangChain · RAG Demo
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                AI Knowledge Base Chat
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                Paste any text (FAQ, docs, policies, articles) and ask questions
                about it. The model answers using{" "}
                <span className="font-medium text-emerald-300">
                retrieval-augmented generation
              </span>{" "}
                on top of your content.
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 md:mt-0 md:flex-col md:items-end">
              <div className="rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 shadow-lg shadow-emerald-500/10">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Tech stack
                </div>
                <div className="mt-1 text-xs font-medium text-slate-100">
                  Next.js · LangChain · OpenAI · Tailwind
                </div>
              </div>
            </div>
          </header>

          {/* Main grid */}
          <section className="grid flex-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* Knowledge base input */}
            <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-xl shadow-black/40 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100 md:text-base">
                    Knowledge base
                  </h2>
                  <p className="text-xs text-slate-400 md:text-[13px]">
                    Paste any long-form text the assistant should know about.
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
                {charsLabel}
              </span>
              </div>

              <textarea
                  className="mt-1 h-72 w-full flex-1 resize-none rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm leading-relaxed text-slate-100 outline-none ring-emerald-500/30 transition focus:border-emerald-400/70 focus:ring-2 md:h-full"
                  placeholder="Paste your FAQ, documentation, article or policy text here..."
                  value={kbText}
                  onChange={(e) => setKbText(e.target.value)}
              />

              <p className="mt-2 text-[11px] text-slate-500">
                Your text is processed in-memory for this demo and not stored.
              </p>
            </div>

            {/* Chat panel */}
            <div className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-xl shadow-black/40 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100 md:text-base">
                    Chat with your text
                  </h2>
                  <p className="text-xs text-slate-400 md:text-[13px]">
                    Ask questions, request summaries or clarifications. The AI
                    answers strictly from the provided context.
                  </p>
                </div>
                {loading && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Thinking…
                </span>
                )}
              </div>

              {/* Chat history */}
              <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex h-full flex-col gap-2 overflow-y-auto p-3 text-sm">
                  {messages.length === 0 && (
                      <div className="flex h-full items-center justify-center text-center text-xs text-slate-400">
                        <div>
                          <p>Start by pasting some text on the left,</p>
                          <p>then ask your first question here. ✨</p>
                        </div>
                      </div>
                  )}

                  {messages.map((m, i) => (
                      <div
                          key={i}
                          className={`flex ${
                              m.role === "user" ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
                                m.role === "user"
                                    ? "bg-emerald-500 text-emerald-950"
                                    : "bg-slate-800 text-slate-100"
                            }`}
                        >
                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                            {m.role === "user" ? "You" : "AI"}
                          </div>
                          <div>{m.content}</div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleAsk} className="mt-3 flex gap-2">
                <input
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/30 transition focus:border-emerald-400/70 focus:ring-2"
                    placeholder="Ask a question about the text…"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Thinking…" : "Ask"}
                </button>
              </form>

              {error && (
                  <p className="mt-2 text-[11px] text-rose-300">{error}</p>
              )}
            </div>
          </section>

          {/* Footer note */}
          <footer className="mt-6 text-[11px] text-slate-500">
            Demo project – built with Next.js, LangChain and OpenAI. Perfect for
            showcasing AI integration & RAG on Upwork.
          </footer>
        </div>
      </main>
  );
}
