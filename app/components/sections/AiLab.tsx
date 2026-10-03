"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Database,
  GitBranch,
  Loader2,
  MessageCircle,
  Network,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const prompts = [
  "I run a business. What can IT HUNKS automate for me?",
  "I need a CRM and ERP for my company",
  "Can you build an AI chatbot trained on my company documents?",
  "How much does a custom AI solution cost?",
];

const workflows = [
  { label: "New customer message", icon: MessageCircle, detail: "Trigger" },
  { label: "AI understands intent", icon: BrainCircuit, detail: "LLM / intent layer" },
  { label: "Knowledge is retrieved", icon: Database, detail: "RAG / approved data" },
  { label: "Response / business action", icon: Zap, detail: "CRM, WhatsApp or workflow" },
];

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I’m the IT HUNKS AI Copilot. Tell me what you want to build, automate or improve — even if you’re not sure about the technical details. I’ll help turn the requirement into a practical software or AI solution.",
};

export default function AiLab() {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeWorkflow, setActiveWorkflow] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ithunks-ai-chat");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed.slice(-14));
      }
    } catch {
      // Ignore malformed local chat history.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ithunks-ai-chat", JSON.stringify(messages.slice(-14)));
    } catch {
      // Local storage can be disabled by privacy settings.
    }
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, reduceMotion]);

  const ask = async (value?: string) => {
    const clean = (value ?? query).trim();
    if (!clean || loading) return;

    const userMessage: ChatMessage = { role: "user", content: clean };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setQuery("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "The AI could not answer right now.");
      setMessages((current) => [...current, { role: "assistant", content: data.message }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask();
  };

  const clearChat = () => {
    setMessages([starterMessage]);
    setError("");
    localStorage.removeItem("ithunks-ai-chat");
  };

  const runWorkflow = () => {
    setActiveWorkflow(0);
    workflows.forEach((_, index) => {
      window.setTimeout(() => setActiveWorkflow(index), index * 650);
    });
    window.setTimeout(() => setActiveWorkflow(-1), workflows.length * 650 + 500);
  };

  return (
    <section id="ai-lab" className="section-shell relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="section-orb -left-64 top-1/3 bg-blue-500/10" />
      <div className="section-orb -right-72 bottom-0 bg-cyan-500/[0.07]" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="IT HUNKS AI LAB"
          title="Don’t just read about AI."
          accent="talk to it."
          description="A real AI-powered product conversation — not a fixed demo. Ask about your business, requirements, automation ideas, AI chatbots, CRM/ERP or anything you want to build."
        />

        <div className="mt-14 overflow-hidden rounded-[28px] border border-blue-400/15 bg-[#080b10] shadow-[0_35px_120px_rgba(0,0,0,.35)] lg:mt-20">
          <div className="flex flex-col border-b border-white/[0.07] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 px-5 py-4 sm:px-7">
              <span className="grid size-10 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Bot className="size-5" /></span>
              <div>
                <p className="text-sm font-semibold text-white">IT HUNKS AI Copilot</p>
                <p className="text-[11px] text-zinc-600">Live LLM conversation · context-aware</p>
              </div>
              <span className="ml-1 flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> AI ready</span>
            </div>
            <div className="flex flex-wrap gap-2 px-5 pb-4 lg:justify-end lg:px-7 lg:pb-0">
              {["LLM", "RAG-ready", "Chatbots", "Automation"].map((item) => <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-zinc-500">{item}</span>)}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400"><Sparkles className="size-3.5 text-blue-400" /> Ask anything about your requirement</div>
                <button type="button" onClick={clearChat} className="flex items-center gap-1.5 text-[10px] text-zinc-600 transition hover:text-zinc-300"><RotateCcw className="size-3" /> Clear</button>
              </div>

              <div className="h-[390px] overflow-y-auto rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:p-5">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div key={`${index}-${message.role}`} initial={reduceMotion ? undefined : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-6 ${message.role === "user" ? "rounded-tr-md border border-blue-400/15 bg-blue-500/[0.08] text-blue-50" : "rounded-tl-md border border-white/[0.07] bg-white/[0.025] text-zinc-300"}`}>
                        {message.role === "assistant" && <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-blue-300"><Bot className="size-3.5" /> IT HUNKS AI</div>}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-md border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-500"><Loader2 className="size-3.5 animate-spin text-blue-400" /> Thinking about your requirement…</div>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              {error && (
                <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-[11px] leading-5 text-amber-200">
                  {error}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button key={prompt} type="button" disabled={loading} onClick={() => void ask(prompt)} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-zinc-400 transition hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40">{prompt}</button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-4 flex gap-2 rounded-xl border border-white/[0.08] bg-black/20 p-2 focus-within:border-blue-400/30">
                <MessageCircle className="ml-2 mt-2.5 size-4 shrink-0 text-zinc-600" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} disabled={loading} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs text-zinc-200 outline-none placeholder:text-zinc-700" placeholder="Tell the AI what your business needs…" aria-label="Ask IT HUNKS AI" />
                <button type="submit" disabled={loading || !query.trim()} className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send className="size-4" /></button>
              </form>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-white">AI business workflow</p>
                  <p className="mt-1 text-[11px] text-zinc-600">See how a production automation can be structured.</p>
                </div>
                <button type="button" onClick={runWorkflow} className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[10px] font-semibold text-blue-200 transition hover:bg-blue-500/20"><Play className="size-3" /> Run demo</button>
              </div>

              <div className="relative mt-7 space-y-3">
                {workflows.map(({ label, icon: Icon, detail }, index) => (
                  <div key={label} className="relative">
                    {index < workflows.length - 1 && <span className={`absolute left-[19px] top-11 h-7 w-px transition-colors duration-300 ${activeWorkflow > index ? "bg-blue-400" : "bg-white/10"}`} />}
                    <motion.div animate={activeWorkflow === index && !reduceMotion ? { scale: [1, 1.015, 1], x: [0, 3, 0] } : { scale: 1, x: 0 }} transition={{ duration: 0.5 }} className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${activeWorkflow === index ? "border-blue-400/35 bg-blue-500/[0.08] shadow-[0_0_35px_rgba(59,130,246,.1)]" : "border-white/[0.07] bg-white/[0.02]"}`}>
                      <span className={`grid size-10 shrink-0 place-items-center rounded-xl border ${activeWorkflow === index ? "border-blue-400/30 bg-blue-500/15 text-blue-300" : "border-white/[0.07] bg-white/[0.025] text-zinc-600"}`}><Icon className="size-4" /></span>
                      <div className="min-w-0"><p className="text-xs font-medium text-zinc-200">{label}</p><p className="mt-1 text-[10px] text-zinc-600">{detail}</p></div>
                      {activeWorkflow >= index && <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-400" />}
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: Network, label: "LLM" },
                  { icon: Database, label: "RAG" },
                  { icon: Workflow, label: "Automation" },
                ].map(({ icon: Icon, label }) => <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"><Icon className="mx-auto size-4 text-blue-400" /><p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">{label}</p></div>)}
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-blue-500/[0.08] to-transparent p-5">
                <p className="text-xs font-semibold text-white">What makes this different?</p>
                <ul className="mt-3 space-y-2 text-[11px] leading-5 text-zinc-500">
                  <li>• The assistant responds to free-form requirements, not only buttons.</li>
                  <li>• Conversation history is remembered in the visitor’s browser.</li>
                  <li>• The server keeps the AI key private and can connect to an LLM provider.</li>
                  <li>• The same architecture can evolve into RAG, CRM actions and WhatsApp automation.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/[0.07] bg-blue-500/[0.035] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div><p className="text-sm font-semibold text-white">Have an AI idea for your business?</p><p className="mt-1 text-xs text-zinc-500">Turn the conversation into a production-ready assistant, automation or custom AI system.</p></div>
            <a href="#contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-400">Build an AI solution <ArrowRight className="size-3.5" /></a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: BrainCircuit, title: "Live LLM conversations", text: "Let visitors describe a real business requirement in their own words." },
            { icon: Database, title: "RAG-ready architecture", text: "Ground future answers in approved company documents and business data." },
            { icon: GitBranch, title: "AI automation", text: "Move from conversation to CRM, WhatsApp and internal workflow actions." },
          ].map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <Icon className="size-5 text-blue-400" />
              <p className="mt-4 text-sm font-semibold text-white">{title}</p>
              <p className="mt-1.5 text-xs leading-5 text-zinc-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
