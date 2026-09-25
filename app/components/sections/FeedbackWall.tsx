"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { FEEDBACK_STORAGE_KEY, FEEDBACK_UPDATED_EVENT, type FeedbackEntry } from "../Feedback";

function loadFeedback(): FeedbackEntry[] {
  try {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function FeedbackWall() {
  const [items, setItems] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    const refresh = () => setItems(loadFeedback());
    refresh();
    window.addEventListener(FEEDBACK_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FEEDBACK_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <section id="feedback" className="section-shell relative py-24 sm:py-28">
      <div className="section-orb -left-48 top-20 bg-blue-500/10" />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Client feedback</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-5xl">Tell us how we&apos;re doing.</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-500 sm:text-base">Real feedback from visitors is displayed here after it is submitted.</p>
        </div>

        {items.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((item, index) => (
              <motion.article key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={`size-4 ${value <= item.rating ? "fill-blue-400 text-blue-400" : "text-zinc-700"}`} />)}</div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Feedback</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-zinc-300">“{item.feedback}”</p>
                <p className="mt-5 text-xs font-semibold text-white">{item.name}</p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-300"><MessageSquareText className="size-5" /></span>
            <p className="mt-4 font-heading text-lg font-semibold text-white">No feedback yet</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Be the first visitor to share your experience using the Feedback tab on the left.</p>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] leading-4 text-zinc-700">Feedback is stored in this browser&apos;s local storage. It is not shared across devices or visitors until a backend/database is connected.</p>
      </div>
    </section>
  );
}
