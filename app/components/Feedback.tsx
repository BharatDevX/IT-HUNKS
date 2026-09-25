"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageSquareText, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

export type FeedbackEntry = {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  createdAt: string;
};

export const FEEDBACK_STORAGE_KEY = "ithunks-feedback";
export const FEEDBACK_UPDATED_EVENT = "ithunks-feedback-updated";

function readFeedback(): FeedbackEntry[] {
  try {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleUpdated = () => {
      // Keep the feedback wall and this form synchronized in the same browser.
      readFeedback();
    };
    window.addEventListener(FEEDBACK_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(FEEDBACK_UPDATED_EVENT, handleUpdated);
  }, []);

  const submit = () => {
    if (!rating) return;

    const entry: FeedbackEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || "Anonymous visitor",
      rating,
      feedback: feedback.trim() || "No written feedback.",
      createdAt: new Date().toISOString(),
    };

    const existing = readFeedback();
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 30)));
    window.dispatchEvent(new Event(FEEDBACK_UPDATED_EVENT));

    // Also prepare an email so the IT HUNKS team can receive the feedback directly.
    const subject = encodeURIComponent(`IT HUNKS Website Feedback - ${rating}/5`);
    const body = encodeURIComponent(`Name: ${entry.name}\nRating: ${rating}/5\n\nFeedback:\n${entry.feedback}`);
    window.location.href = `mailto:ithunks.in@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const resetForm = () => {
    setSent(false);
    setName("");
    setRating(0);
    setFeedback("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed left-0 top-1/2 z-[65] -translate-y-1/2 rounded-r-xl border border-white/10 border-l-0 bg-[#0b0d11]/95 px-2.5 py-3 text-zinc-300 shadow-[0_10px_35px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all hover:border-blue-400/30 hover:text-white" aria-label="Give website feedback">
        <span className="flex flex-col items-center gap-1">
          <MessageSquareText className="size-4 text-blue-400" />
          <span className="[writing-mode:vertical-rl] text-[9px] font-semibold uppercase tracking-[0.15em]">Feedback</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0d11] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">Quick feedback</p>
                  <h3 className="mt-1 font-heading text-2xl text-white">How was your experience?</h3>
                </div>
                <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-white/[0.04] text-zinc-500 hover:text-white" aria-label="Close feedback"><X className="size-4" /></button>
              </div>

              {!sent ? (
                <>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-6 w-full rounded-xl border border-white/[0.08] bg-black/20 p-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-blue-400/40" placeholder="Your name (optional)" />
                  <div className="mt-5 flex justify-center gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} onClick={() => setRating(value)} aria-label={`${value} stars`} className="p-1"><Star className={`size-8 transition-all ${value <= rating ? "fill-blue-400 text-blue-400" : "text-zinc-700 hover:text-zinc-400"}`} /></button>)}</div>
                  <p className="mt-2 text-center text-xs text-zinc-600">{rating ? `${rating} out of 5` : "Select a rating"}</p>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="mt-5 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 p-3 text-sm text-zinc-200 outline-none focus:border-blue-400/40" placeholder="What did you like or what should we improve?" />
                  <button disabled={!rating} onClick={submit} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-blue-400"><MessageSquareText className="size-4" /> Save & send feedback</button>
                  <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">Your feedback is saved locally on this device. No database is used.</p>
                </>
              ) : (
                <div className="py-10 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Check className="size-5" /></span>
                  <h4 className="mt-4 font-heading text-xl text-white">Thank you!</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">Your feedback has been saved on this device and your email client has been opened.</p>
                  <button onClick={resetForm} className="mt-5 text-xs font-semibold text-blue-400 hover:text-blue-300">Submit another response</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
