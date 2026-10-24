import Image from "next/image";

/**
 * Static, CSS-only Trackzy composition used when WebGL is unavailable (or the GPU context is lost).
 * Mirrors the 3D layout — emblem in the centre, dashboard behind, mobile app in front — with no JavaScript animation.
 */
export default function TrackzyFallback({ side = true }: { side?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute top-1/2 aspect-[1.35/1] w-[min(92vw,640px)] -translate-y-1/2 ${side ? "left-1/2 -translate-x-1/2 lg:left-[54%] lg:w-[min(42vw,700px)] lg:translate-x-0" : "left-1/2 -translate-x-1/2"}`}
      >
        <div className="absolute inset-[8%] rounded-full bg-blue-500/20 blur-[90px]" />
        {/* dashboard */}
        <div className="absolute left-[2%] top-[6%] h-[62%] w-[78%] rounded-2xl border border-blue-400/30 bg-[#0a1120]/95 p-4 shadow-[0_0_60px_rgba(59,130,246,.18)]">
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-teal-400" /><span className="h-2 w-20 rounded bg-white/20" /></div>
          <div className="mt-4 grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((i) => <span key={i} className="h-10 rounded-lg border border-white/10 bg-white/[.04]" />)}</div>
          <svg viewBox="0 0 200 60" className="mt-4 h-[38%] w-full" preserveAspectRatio="none"><path d="M0 50 L30 38 L60 44 L95 24 L130 30 L165 12 L200 4" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M0 52 L40 46 L80 44 L120 36 L160 30 L200 22" fill="none" stroke="#16c2a8" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        {/* mobile app */}
        <div className="absolute bottom-[2%] right-[4%] h-[66%] w-[26%] rounded-[1.4rem] border border-blue-300/40 bg-[#080d1a] p-2.5 shadow-[0_0_50px_rgba(34,211,238,.15)]">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-black" />
          <div className="mt-3 h-2 w-12 rounded bg-white/25" />
          <div className="mt-2 h-8 rounded-lg border border-white/10 bg-white/[.05]" />
          <div className="mt-2 h-16 rounded-lg border border-white/10 bg-[#0b1426]" />
          <div className="mt-2 space-y-1.5">{[0, 1, 2].map((i) => <span key={i} className="block h-5 rounded-md border border-white/10 bg-white/[.04]" />)}</div>
        </div>
        {/* emblem */}
        <div className="absolute left-1/2 top-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_40px_rgba(59,130,246,.55)]">
          <Image src="/trackzy-logo.png" alt="" width={256} height={256} className="size-full rounded-[22%]" priority />
        </div>
      </div>
    </div>
  );
}
