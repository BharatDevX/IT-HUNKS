import { ImageResponse } from "next/og";

export const alt = "IT HUNKS — Websites, Mobile Apps and AI Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "#050505",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            right: -180,
            top: -240,
            borderRadius: 9999,
            background: "rgba(59,130,246,.28)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
        <div style={{ display: "flex", width: "100%", padding: "80px", flexDirection: "column", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#60a5fa", fontSize: 22, letterSpacing: 4 }}>
            <span style={{ display: "flex", width: 40, height: 2, background: "#60a5fa" }} />
            IT HUNKS
          </div>
          <div style={{ display: "flex", marginTop: 42, maxWidth: 930, fontSize: 72, lineHeight: 1.02, fontWeight: 700, letterSpacing: -4 }}>
            Digital products built to grow businesses.
          </div>
          <div style={{ display: "flex", marginTop: 32, color: "#a1a1aa", fontSize: 25 }}>
            Websites · Mobile Apps · AI Integration · UI/UX
          </div>
        </div>
      </div>
    ),
    size,
  );
}
