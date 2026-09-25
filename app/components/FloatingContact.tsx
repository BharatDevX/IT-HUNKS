"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mail, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

const whatsapp = "919528681406";

const quickReplies: Record<string, string> = {
  Website: "For a premium business website, our starting package is ₹14,999. We can discuss pages, integrations and delivery on WhatsApp.",
  App: "For a premium mobile app, our starting package is ₹24,999. We can discuss your app flow, API and deployment requirements on WhatsApp.",
  "CRM / ERP": "Our CRM / ERP package starts at ₹34,999 and can cover sales, field operations, inventory, expenses and dashboards.",
  AI: "Our AI solution / chatbot package starts at ₹24,999 and can include LLMs, RAG, customer assistants and business automation.",
};

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Hi! I'm looking for a technology solution for my business.");
  const [reply, setReply] = useState("Tell us what you need. I can point you to the right IT HUNKS service and then connect you directly with our team on WhatsApp.");

  const sendWhatsApp = (text = message) => {
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} className="mb-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-blue-400/20 bg-[#090c12]/95 shadow-[0_25px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Bot className="size-4" /></span><div><p className="text-sm font-semibold text-white">IT HUNKS AI Assistant</p><p className="text-[10px] text-zinc-500">Quick project guidance</p></div></div>
              <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-zinc-500 hover:bg-white/5 hover:text-white" aria-label="Close assistant"><X className="size-4" /></button>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-xs leading-5 text-zinc-400"><span className="mb-1 flex items-center gap-1.5 text-blue-300"><Sparkles className="size-3" /> Assistant</span>{reply}</div>
              <div className="flex flex-wrap gap-2">{Object.keys(quickReplies).map((item) => <button key={item} onClick={() => setReply(quickReplies[item])} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] text-zinc-300 hover:border-blue-400/30 hover:text-white">{item}</button>)}</div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-blue-400/40" placeholder="Describe your requirement..." />
              <button onClick={() => sendWhatsApp()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-400"><MessageCircle className="size-4" /> Continue on WhatsApp</button>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500"><a href="tel:+919528681406" className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] p-2.5 hover:text-white"><Phone className="size-3" /> 9528681406</a><a href="mailto:ithunks.in@gmail.com" className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] p-2.5 hover:text-white"><Mail className="size-3" /> Email us</a></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOpen((value) => !value)} className="group flex items-center gap-2.5 rounded-full border border-blue-300/30 bg-blue-500 px-4 py-3 text-xs font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,.35)]" aria-label="Open IT HUNKS AI WhatsApp assistant"><span className="relative grid size-7 place-items-center rounded-full bg-white/15"><Send className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><span className="hidden sm:inline">AI WhatsApp Assistant</span><span className="sm:hidden">Chat</span></motion.button>
    </div>
  );
}
