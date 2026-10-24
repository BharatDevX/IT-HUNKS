/**
 * Canvas-2D renderers for the Trackzy interface previews that become textures in the 3D scene.
 * Everything is drawn procedurally in a fixed "design" coordinate space (no network assets) and scaled to the
 * texture size, so the same code serves desktop and lite (smaller texture) rendering.
 *
 * All figures are SAMPLE data for illustration only — never real employees, locations or customers.
 */
import type { PanelId } from "./story-layout";

export type PanelState = {
  /** Animation clock in seconds (frozen at 0 for reduced motion). */
  t: number;
  /** 0..1 — charts / rings / progress "arrive" as this rises. */
  reveal: number;
};

type G = CanvasRenderingContext2D;

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const C = {
  bg: "#09101e",
  surf: "#0e1729",
  surf2: "#131f37",
  line: "rgba(120,160,255,0.14)",
  border: "rgba(96,165,250,0.42)",
  text: "#e8efff",
  muted: "#8ea3c8",
  dim: "#5b6f96",
  blue: "#3b82f6",
  sky: "#60a5fa",
  cyan: "#22d3ee",
  teal: "#16c2a8",
  amber: "#f5b83d",
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/* ─────────────────────────────── helpers ─────────────────────────────── */

function rr(g: G, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rad, y);
  g.arcTo(x + w, y, x + w, y + h, rad);
  g.arcTo(x + w, y + h, x, y + h, rad);
  g.arcTo(x, y + h, x, y, rad);
  g.arcTo(x, y, x + w, y, rad);
  g.closePath();
}

function box(g: G, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient, stroke?: string, lw = 1.5) {
  rr(g, x, y, w, h, r);
  g.fillStyle = fill;
  g.fill();
  if (stroke) {
    g.lineWidth = lw;
    g.strokeStyle = stroke;
    g.stroke();
  }
}

function label(g: G, s: string, x: number, y: number, size: number, color = C.text, weight = 500, align: CanvasTextAlign = "left") {
  g.font = `${weight} ${size}px ${FONT}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = "alphabetic";
  g.fillText(s, x, y);
}

function grad(g: G, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => gr.addColorStop(o, c));
  return gr;
}

function chip(g: G, s: string, x: number, y: number, color: string, size = 15, align: "left" | "right" = "left") {
  g.font = `600 ${size}px ${FONT}`;
  const w = g.measureText(s).width + size * 1.4;
  const h = size * 1.85;
  const x0 = align === "right" ? x - w : x;
  box(g, x0, y, w, h, h / 2, color + "26", color + "66", 1.2);
  label(g, s, x0 + w / 2, y + h * 0.69, size, color, 600, "center");
  return w;
}

/** The Trackzy mark, redrawn from the supplied logo geometry (navy tile, white stroke, teal dot). */
export function drawMark(g: G, x: number, y: number, s: number) {
  box(g, x, y, s, s, s * 0.22, "#0e1a32", "rgba(130,170,255,0.38)", Math.max(1, s * 0.02));
  const p = (px: number, py: number): [number, number] => [x + (px / 512) * s, y + (py / 512) * s];
  const pts = [p(150, 345), p(226, 258), p(308, 306), p(387, 160)];
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = "#f4f6fa";
  g.lineWidth = s * 0.07;
  g.beginPath();
  pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
  g.stroke();
  const [dx, dy] = p(387, 155);
  g.fillStyle = C.teal;
  g.beginPath();
  g.arc(dx, dy, (41 / 512) * s, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function card(g: G, x: number, y: number, w: number, h: number, r = 14) {
  box(g, x, y, w, h, r, C.surf, C.line, 1.5);
}

function windowFrame(g: G, w: number, h: number, r: number) {
  box(g, 2, 2, w - 4, h - 4, r, grad(g, 0, 0, 0, h, [[0, "#0b1324"], [1, "#080e1b"]]), C.border, 2.5);
}

/** Area/line chart with a partial reveal. `vals` are 0..1. */
function areaChart(g: G, x: number, y: number, w: number, h: number, vals: number[], reveal: number, t: number, color: string) {
  const n = vals.length;
  const pts = vals.map((v, i) => [x + (i / (n - 1)) * w, y + h - (v * (1 + 0.025 * Math.sin(t * 0.9 + i * 1.3))) * h] as [number, number]);
  const upto = clamp01(reveal) * (n - 1);
  const shown: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    if (i <= upto) shown.push(pts[i]);
    else if (i - 1 < upto) {
      const f = upto - (i - 1);
      shown.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]);
      break;
    }
  }
  if (shown.length < 2) return;
  g.save();
  g.beginPath();
  shown.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
  g.lineTo(shown[shown.length - 1][0], y + h);
  g.lineTo(shown[0][0], y + h);
  g.closePath();
  g.fillStyle = grad(g, 0, y, 0, y + h, [[0, color + "55"], [1, color + "00"]]);
  g.fill();
  g.beginPath();
  shown.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
  g.lineWidth = 4;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.strokeStyle = color;
  g.shadowColor = color;
  g.shadowBlur = 12;
  g.stroke();
  g.shadowBlur = 0;
  const [lx, ly] = shown[shown.length - 1];
  g.beginPath();
  g.arc(lx, ly, 7 + Math.sin(t * 3) * 1.2, 0, Math.PI * 2);
  g.fillStyle = "#fff";
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = color;
  g.stroke();
  g.restore();
}

function gridLines(g: G, x: number, y: number, w: number, h: number, rows: number) {
  g.save();
  g.strokeStyle = "rgba(140,170,255,0.09)";
  g.lineWidth = 1;
  for (let i = 0; i <= rows; i++) {
    const yy = y + (i / rows) * h;
    g.beginPath();
    g.moveTo(x, yy);
    g.lineTo(x + w, yy);
    g.stroke();
  }
  g.restore();
}

function ring(g: G, cx: number, cy: number, r: number, lw: number, value: number, colorA: string, colorB: string) {
  g.save();
  g.lineWidth = lw;
  g.lineCap = "round";
  g.strokeStyle = "rgba(140,170,255,0.12)";
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.stroke();
  if (value > 0.002) {
    g.strokeStyle = grad(g, cx - r, cy - r, cx + r, cy + r, [[0, colorA], [1, colorB]]);
    g.shadowColor = colorB;
    g.shadowBlur = 14;
    g.beginPath();
    g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * value);
    g.stroke();
  }
  g.restore();
}

/* ─────────────────────────────── panels ─────────────────────────────── */

const NAV = ["Dashboard", "Employees", "Attendance", "Live tracking", "Sales orders", "Follow-ups", "Reports"];
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Desktop admin dashboard — 1280 × 800. */
function drawDash(g: G, st: PanelState) {
  const W = 1280;
  const H = 800;
  windowFrame(g, W, H, 26);
  g.save();
  rr(g, 2, 2, W - 4, H - 4, 26);
  g.clip();

  // Top bar
  g.fillStyle = "#0d1628";
  g.fillRect(2, 2, W - 4, 66);
  g.fillStyle = C.line;
  g.fillRect(2, 67, W - 4, 1.5);
  drawMark(g, 28, 17, 36);
  label(g, "Trackzy", 76, 43, 25, C.text, 700);
  label(g, "Admin  /  Dashboard", 196, 42, 18, C.muted, 500);
  box(g, 820, 18, 250, 34, 17, "rgba(255,255,255,0.045)", C.line, 1.2);
  label(g, "Search…", 846, 41, 16, C.dim);
  chip(g, "Sample data", 1195, 20, C.amber, 14, "right");
  g.beginPath();
  g.arc(1236, 35, 18, 0, Math.PI * 2);
  g.fillStyle = grad(g, 1218, 17, 1254, 53, [[0, C.blue], [1, C.cyan]]);
  g.fill();

  // Sidebar
  g.fillStyle = "#0a1222";
  g.fillRect(2, 68, 236, H - 70);
  NAV.forEach((n, i) => {
    const y = 96 + i * 54;
    if (i === 0) {
      box(g, 16, y - 8, 208, 44, 11, "rgba(59,130,246,0.17)");
      g.fillStyle = C.sky;
      g.fillRect(16, y + 2, 4, 24);
    }
    box(g, 36, y + 3, 20, 20, 6, "rgba(0,0,0,0)", i === 0 ? C.sky : C.dim, 2);
    label(g, n, 72, y + 21, 19, i === 0 ? C.text : C.muted, i === 0 ? 600 : 500);
  });

  // KPI row
  const kpis: [string, string, string, string][] = [
    ["Sales this month", "₹4.82L", "▲ 12%", C.teal],
    ["Visits today", "128", "▲ 8%", C.sky],
    ["Checked in", "46 / 52", "88%", C.cyan],
    ["Follow-ups due", "17", "5 today", C.amber],
  ];
  const kw = (1250 - 264 - 3 * 16) / 4;
  kpis.forEach(([name, value, delta, col], i) => {
    const x = 264 + i * (kw + 16);
    const a = ease(st.reveal * 1.4 - i * 0.12);
    card(g, x, 94, kw, 124);
    label(g, name, x + 20, 128, 17, C.muted, 500);
    g.save();
    g.globalAlpha = a;
    label(g, value, x + 20, 180, 40, C.text, 700);
    g.restore();
    chip(g, delta, x + 20, 188, col, 13);
  });

  // Sales trend
  card(g, 264, 236, 600, 304);
  label(g, "Sales trend", 288, 274, 21, C.text, 600);
  label(g, "This week", 288, 298, 15, C.muted);
  const cx = 296;
  const cy = 326;
  const cw = 540;
  const ch = 168;
  gridLines(g, cx, cy, cw, ch, 4);
  areaChart(g, cx, cy, cw, ch, [0.28, 0.4, 0.34, 0.55, 0.5, 0.72, 0.86], ease(st.reveal * 1.15), st.t, C.sky);
  const secondary = [0.18, 0.26, 0.3, 0.33, 0.42, 0.46, 0.55];
  areaChart(g, cx, cy, cw, ch, secondary, ease(st.reveal * 1.15 - 0.1), st.t + 1.2, C.teal);
  WEEK.forEach((d, i) => label(g, d, cx + (i / 6) * cw, 520, 14, C.dim, 500, "center"));

  // Target ring
  card(g, 880, 236, 370, 304);
  label(g, "Monthly target", 904, 274, 21, C.text, 600);
  label(g, "Progress", 904, 298, 15, C.muted);
  const pct = 0.72 * ease(st.reveal * 1.1);
  ring(g, 1065, 408, 80, 16, pct, C.blue, C.cyan);
  label(g, `${Math.round(pct * 100)}%`, 1065, 420, 44, C.text, 700, "center");
  label(g, "of target", 1065, 446, 15, C.muted, 500, "center");
  box(g, 904, 500, 322, 8, 4, "rgba(140,170,255,0.12)");
  box(g, 904, 500, 322 * pct, 8, 4, grad(g, 904, 0, 1226, 0, [[0, C.blue], [1, C.cyan]]));

  // Team activity
  card(g, 264, 558, 986, 214);
  label(g, "Team activity", 288, 594, 21, C.text, 600);
  const cols = [288, 560, 790, 940];
  ["Team member", "Status", "Visits", "Last activity"].forEach((hd, i) => label(g, hd, cols[i], 628, 14, C.dim, 600));
  const rows: [string, string, string, string, string][] = [
    ["Rep · North Zone", "On visit", "9", "10:42 AM", C.sky],
    ["Rep · East Zone", "Checked in", "6", "10:15 AM", C.teal],
    ["Rep · Central", "Checked in", "7", "10:31 AM", C.teal],
  ];
  rows.forEach(([nm, status, visits, last, col], i) => {
    const y = 648 + i * 42;
    g.fillStyle = C.line;
    g.fillRect(288, y - 8, 938, 1);
    g.beginPath();
    g.arc(302, y + 14, 13, 0, Math.PI * 2);
    g.fillStyle = col + "33";
    g.fill();
    label(g, nm.charAt(6), 302, y + 20, 14, col, 700, "center");
    label(g, nm, 326, y + 20, 18, C.text, 500);
    const pulse = status === "On visit" ? 0.6 + 0.4 * Math.sin(st.t * 3) : 1;
    g.globalAlpha = pulse;
    chip(g, status, cols[1], y + 1, col, 14);
    g.globalAlpha = 1;
    label(g, visits, cols[2], y + 20, 18, C.text, 600);
    label(g, last, cols[3], y + 20, 18, C.muted, 500);
  });
  g.restore();
}

/** Mobile employee app — 520 × 1064. */
function drawPhone(g: G, st: PanelState) {
  const W = 520;
  const H = 1064;
  box(g, 3, 3, W - 6, H - 6, 74, "#05080f", "rgba(150,185,255,0.55)", 5);
  box(g, 18, 18, W - 36, H - 36, 60, grad(g, 0, 0, 0, H, [[0, "#0c1527"], [1, "#080d1a"]]));
  g.save();
  rr(g, 18, 18, W - 36, H - 36, 60);
  g.clip();

  box(g, W / 2 - 54, 34, 108, 30, 15, "#02040a");
  label(g, "9:41", 64, 60, 20, C.text, 700);
  label(g, "●●●", 456, 60, 14, C.muted, 600, "right");

  label(g, "Good morning", 44, 128, 20, C.muted);
  label(g, "Today’s plan", 44, 170, 36, C.text, 700);
  drawMark(g, 420, 108, 56);

  // Attendance
  card(g, 40, 204, 440, 108, 20);
  const live = 0.55 + 0.45 * Math.sin(st.t * 2.6);
  g.beginPath();
  g.arc(78, 258, 8, 0, Math.PI * 2);
  g.fillStyle = C.teal;
  g.globalAlpha = live;
  g.fill();
  g.globalAlpha = 1;
  label(g, "Checked in", 102, 252, 22, C.text, 600);
  label(g, "09:02 AM · Attendance", 102, 282, 16, C.muted);
  chip(g, "On duty", 468, 238, C.teal, 14, "right");

  // Route preview
  card(g, 40, 330, 440, 258, 20);
  g.save();
  rr(g, 40, 330, 440, 258, 20);
  g.clip();
  g.fillStyle = "#0b1426";
  g.fillRect(40, 330, 440, 258);
  g.strokeStyle = "rgba(140,170,255,0.08)";
  g.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    g.beginPath();
    g.moveTo(40 + i * 56, 330);
    g.lineTo(40 + i * 56, 588);
    g.stroke();
    g.beginPath();
    g.moveTo(40, 330 + i * 40);
    g.lineTo(480, 330 + i * 40);
    g.stroke();
  }
  const route: [number, number][] = [[84, 548], [150, 480], [226, 500], [292, 428], [350, 440], [420, 372]];
  g.lineJoin = "round";
  g.lineCap = "round";
  g.lineWidth = 6;
  g.strokeStyle = "rgba(34,211,238,0.28)";
  g.beginPath();
  route.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
  g.setLineDash([14, 12]);
  g.lineDashOffset = -st.t * 24;
  g.lineWidth = 4;
  g.strokeStyle = C.cyan;
  g.stroke();
  g.setLineDash([]);
  route.forEach(([x, y], i) => {
    g.beginPath();
    g.arc(x, y, i === route.length - 1 ? 11 : 7, 0, Math.PI * 2);
    g.fillStyle = i === route.length - 1 ? C.teal : "#0b1426";
    g.fill();
    g.lineWidth = 3;
    g.strokeStyle = i === route.length - 1 ? "#fff" : C.sky;
    g.stroke();
  });
  g.restore();
  label(g, "Route preview", 60, 366, 17, C.text, 600);
  chip(g, "Illustrative", 196, 346, C.amber, 12);

  // Visits
  label(g, "Visits", 44, 634, 22, C.text, 700);
  const visits: [string, string, string, string][] = [
    ["Client visit · Zone 1", "10:30 AM", "Done", C.teal],
    ["Client visit · Zone 2", "12:15 PM", "Next", C.sky],
    ["Follow-up call", "03:00 PM", "Planned", C.muted],
  ];
  visits.forEach(([name, time, status, col], i) => {
    const y = 654 + i * 74;
    card(g, 40, y, 440, 62, 16);
    g.beginPath();
    g.arc(70, y + 31, 10, 0, Math.PI * 2);
    g.fillStyle = col + "33";
    g.fill();
    g.beginPath();
    g.arc(70, y + 31, 4, 0, Math.PI * 2);
    g.fillStyle = col;
    g.fill();
    label(g, name, 94, y + 28, 18, C.text, 600);
    label(g, time, 94, y + 50, 14, C.muted);
    chip(g, status, 462, y + 16, col, 13, "right");
  });

  // Action
  box(g, 40, 884, 440, 70, 35, grad(g, 40, 0, 480, 0, [[0, C.blue], [1, C.cyan]]));
  label(g, "+  Add sales entry", W / 2, 928, 22, "#fff", 700, "center");

  // Tab bar
  g.fillStyle = "rgba(255,255,255,0.04)";
  g.fillRect(18, 976, W - 36, H - 36 - 958);
  ["Home", "Visits", "Orders", "Profile"].forEach((tb, i) => {
    const x = 18 + ((W - 36) / 4) * (i + 0.5);
    box(g, x - 11, 990, 22, 22, 7, "rgba(0,0,0,0)", i === 0 ? C.sky : C.dim, 2.5);
    label(g, tb, x, 1032, 14, i === 0 ? C.text : C.dim, 600, "center");
  });
  g.restore();
}

/** Sales analytics card — 760 × 500. */
function drawSales(g: G, st: PanelState) {
  const W = 760;
  const H = 500;
  windowFrame(g, W, H, 24);
  label(g, "Sales analytics", 36, 62, 28, C.text, 700);
  label(g, "Orders by day · sample data", 36, 92, 17, C.muted);
  chip(g, "Week", 724, 38, C.sky, 15, "right");

  const x = 52;
  const y = 130;
  const w = 450;
  const h = 290;
  gridLines(g, x, y, w, h, 4);
  const vals = [0.42, 0.58, 0.5, 0.74, 0.66, 0.88, 0.8];
  const bw = 42;
  vals.forEach((v, i) => {
    const a = ease(st.reveal * 1.3 - i * 0.1);
    const bh = v * h * a * (1 + 0.03 * Math.sin(st.t * 1.1 + i));
    const bx = x + 14 + i * (w / 7);
    box(g, bx, y + h - bh, bw, bh, 9, grad(g, 0, y + h - bh, 0, y + h, [[0, i === 5 ? C.cyan : C.sky], [1, C.blue + "55"]]));
    label(g, WEEK[i], bx + bw / 2, y + h + 30, 15, C.dim, 500, "center");
  });

  card(g, 536, 130, 190, 130, 16);
  label(g, "Orders", 556, 166, 16, C.muted);
  label(g, String(Math.round(214 * ease(st.reveal))), 556, 214, 44, C.text, 700);
  chip(g, "▲ 9%", 556, 224, C.teal, 13);
  card(g, 536, 276, 190, 144, 16);
  label(g, "Target", 556, 312, 16, C.muted);
  ring(g, 631, 370, 34, 10, 0.72 * ease(st.reveal), C.blue, C.cyan);
  label(g, "72%", 631, 377, 18, C.text, 700, "center");
}

/** Workflow strip — 920 × 420. */
function drawFlow(g: G, st: PanelState) {
  const W = 920;
  const H = 420;
  windowFrame(g, W, H, 24);
  label(g, "Workflow", 36, 62, 28, C.text, 700);
  label(g, "From field entry to report", 36, 92, 17, C.muted);
  chip(g, "Illustrative", 884, 38, C.amber, 14, "right");

  const steps = ["Visit logged", "Order entered", "Follow-up set", "Report updated"];
  const subs = ["Mobile app", "Sales entry", "Reminder", "Dashboard"];
  const cycle = (st.t * 0.45) % (steps.length + 0.8);
  const active = st.reveal < 1 ? Math.floor(st.reveal * 4) : Math.min(steps.length - 1, Math.floor(cycle));
  const gap = 196;
  const x0 = 98;
  const y = 214;
  steps.forEach((s, i) => {
    const cx = x0 + i * gap + 60;
    if (i < steps.length - 1) {
      const nx = x0 + (i + 1) * gap + 60;
      g.strokeStyle = i < active ? C.sky : "rgba(140,170,255,0.2)";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(cx + 42, y);
      g.lineTo(nx - 42, y);
      g.stroke();
      if (i === active - 1 || (i === active && active < steps.length - 1)) {
        const f = (st.t * 0.9) % 1;
        const dx = cx + 42 + (nx - cx - 84) * f;
        g.beginPath();
        g.arc(dx, y, 6, 0, Math.PI * 2);
        g.fillStyle = C.cyan;
        g.shadowColor = C.cyan;
        g.shadowBlur = 14;
        g.fill();
        g.shadowBlur = 0;
      }
    }
    const done = i <= active;
    g.beginPath();
    g.arc(cx, y, 38, 0, Math.PI * 2);
    g.fillStyle = done ? "rgba(59,130,246,0.2)" : C.surf;
    g.fill();
    g.lineWidth = 3;
    g.strokeStyle = done ? C.sky : C.line;
    g.stroke();
    label(g, String(i + 1), cx, y + 10, 28, done ? C.text : C.dim, 700, "center");
    label(g, s, cx, y + 76, 19, done ? C.text : C.muted, 600, "center");
    label(g, subs[i], cx, y + 100, 15, C.dim, 500, "center");
  });
  const prog = (active + 1) / steps.length;
  box(g, 36, 366, 848, 8, 4, "rgba(140,170,255,0.12)");
  box(g, 36, 366, 848 * prog, 8, 4, grad(g, 36, 0, 884, 0, [[0, C.blue], [1, C.teal]]));
}

/** Illustrative route map — 720 × 540. */
function drawMap(g: G, st: PanelState) {
  const W = 720;
  const H = 540;
  windowFrame(g, W, H, 24);
  g.save();
  rr(g, 2, 2, W - 4, H - 4, 24);
  g.clip();
  g.fillStyle = "#0a1325";
  g.fillRect(2, 2, W - 4, H - 4);
  g.strokeStyle = "rgba(140,170,255,0.07)";
  g.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    g.beginPath();
    g.moveTo(i * 54, 0);
    g.lineTo(i * 54, H);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i * 54);
    g.lineTo(W, i * 54);
    g.stroke();
  }
  // stylised roads
  g.strokeStyle = "rgba(140,170,255,0.16)";
  g.lineWidth = 7;
  g.lineCap = "round";
  const roads: [number, number][][] = [
    [[0, 420], [180, 360], [340, 380], [520, 300], [720, 260]],
    [[120, 540], [210, 330], [300, 180], [420, 0]],
    [[0, 150], [260, 200], [480, 120], [720, 150]],
    [[560, 540], [540, 340], [600, 160], [640, 0]],
  ];
  roads.forEach((r) => {
    g.beginPath();
    r.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  });
  const route: [number, number][] = [[96, 450], [210, 345], [300, 190], [400, 160], [520, 300], [610, 190]];
  const total = clamp01(st.reveal * 1.2);
  g.lineWidth = 9;
  g.strokeStyle = "rgba(34,211,238,0.22)";
  g.beginPath();
  route.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
  g.setLineDash([18, 14]);
  g.lineDashOffset = -st.t * 30;
  g.lineWidth = 5;
  g.strokeStyle = C.cyan;
  g.stroke();
  g.setLineDash([]);
  route.forEach(([x, y], i) => {
    const a = clamp01(total * route.length - i);
    if (a <= 0) return;
    const last = i === route.length - 1;
    const pulse = last ? 1 + 0.18 * Math.sin(st.t * 3) : 1;
    g.beginPath();
    g.arc(x, y, (last ? 18 : 11) * pulse * a, 0, Math.PI * 2);
    g.fillStyle = last ? C.teal : "#0a1325";
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = last ? "#fff" : C.sky;
    g.stroke();
  });
  g.restore();
  box(g, 28, 26, 300, 76, 16, "rgba(9,16,30,0.88)", C.line, 1.5);
  label(g, "Visit history", 50, 62, 22, C.text, 700);
  label(g, "Route preview · illustrative", 50, 88, 15, C.muted);
  chip(g, "Sample", 692, 30, C.amber, 14, "right");
}

/** Follow-ups notification — 600 × 248. */
function drawNotif(g: G, st: PanelState) {
  const W = 600;
  const H = 248;
  windowFrame(g, W, H, 22);
  label(g, "Follow-ups", 32, 56, 25, C.text, 700);
  const badge = 3;
  g.beginPath();
  g.arc(556, 44, 17 + Math.sin(st.t * 2.4) * 0.8, 0, Math.PI * 2);
  g.fillStyle = C.blue;
  g.fill();
  label(g, String(badge), 556, 51, 18, "#fff", 700, "center");
  const rows: [string, string, string][] = [
    ["Call back · client", "Due today", C.amber],
    ["Send quotation", "Tomorrow", C.sky],
    ["Review visit notes", "This week", C.muted],
  ];
  rows.forEach(([a, b, col], i) => {
    const y = 84 + i * 50;
    g.fillStyle = C.line;
    g.fillRect(32, y - 8, 536, 1);
    g.beginPath();
    g.arc(46, y + 20, 7, 0, Math.PI * 2);
    g.fillStyle = col;
    g.fill();
    label(g, a, 68, y + 27, 20, C.text, 600);
    label(g, b, 568, y + 27, 17, col, 600, "right");
  });
}

const MODULES = ["Attendance", "Location tracking", "Sales entries", "Follow-ups", "Targets & reports", "Custom fields", "Approval step"];
const VARIANTS = [
  { name: "Field Sales", on: [1, 1, 1, 1, 1, 0, 0], flow: ["Visit", "Entry", "Follow-up"], accent: C.sky },
  { name: "Distribution", on: [0, 0, 1, 1, 1, 1, 1], flow: ["Order", "Approval", "Report"], accent: C.cyan },
  { name: "Service Teams", on: [1, 1, 0, 1, 1, 1, 0], flow: ["Request", "Visit", "Report"], accent: C.teal },
];

/** Customization variant card — 840 × 1040. `idx` selects the variant. */
function drawVariant(idx: number) {
  return (g: G, st: PanelState) => {
    const v = VARIANTS[idx];
    const W = 840;
    const H = 1040;
    windowFrame(g, W, H, 34);
    drawMark(g, 48, 46, 56);
    label(g, "Trackzy", 122, 84, 28, C.text, 700);
    chip(g, "Configurable", 792, 52, v.accent, 17, "right");
    label(g, "Configured for", 48, 184, 20, C.muted, 500);
    label(g, v.name, 48, 244, 56, C.text, 700);
    g.fillStyle = grad(g, 48, 0, 400, 0, [[0, v.accent], [1, v.accent + "00"]]);
    g.fillRect(48, 268, 352, 4);

    label(g, "Modules", 48, 342, 22, C.muted, 600);
    MODULES.forEach((m, i) => {
      const y = 372 + i * 70;
      const on = !!v.on[i];
      const a = ease(st.reveal * 1.5 - i * 0.08);
      g.save();
      g.globalAlpha = 0.25 + 0.75 * a;
      card(g, 48, y, 744, 56, 16);
      label(g, m, 76, y + 36, 23, on ? C.text : C.dim, 600);
      box(g, 706, y + 14, 62, 30, 15, on ? v.accent + "55" : "rgba(140,170,255,0.12)", on ? v.accent : C.line, 1.5);
      g.beginPath();
      g.arc(on ? 753 : 721, y + 29, 11, 0, Math.PI * 2);
      g.fillStyle = on ? "#fff" : C.dim;
      g.fill();
      g.restore();
    });

    label(g, "Workflow", 48, 898, 22, C.muted, 600);
    v.flow.forEach((s, i) => {
      const x = 48 + i * 252;
      const act = Math.floor((st.t * 0.6) % 3) === i;
      box(g, x, 920, 216, 56, 28, act ? v.accent + "33" : C.surf, act ? v.accent : C.line, 1.8);
      label(g, s, x + 108, 956, 21, C.text, 600, "center");
      if (i < 2) label(g, "→", x + 234, 956, 24, C.dim, 600, "center");
    });
    label(g, "Customized by IT-HUNKS", W / 2, 1014, 16, C.dim, 500, "center");
  };
}

/* ─────────────────────────── real product screenshots ───────────────────────────
 * The admin panel and employee app are shown with real Trackzy screenshots (public/trackzy/*.jpg).
 * While an image loads a neutral frame is drawn; if it fails to load, the original illustrative drawing is used.
 */
type ShotId = "dash" | "tour" | "app1" | "app2" | "app3";
const SHOT_SRC: Record<ShotId, string> = {
  dash: "/trackzy/admin-dashboard.jpg",
  tour: "/trackzy/admin-tour.jpg",
  app1: "/trackzy/app-1.jpg",
  app2: "/trackzy/app-2.jpg",
  app3: "/trackzy/app-3.jpg",
};
type ShotRt = { img: HTMLImageElement | null; state: "idle" | "loading" | "ready" | "error" };
const shotRt = {} as Record<ShotId, ShotRt>;
(Object.keys(SHOT_SRC) as ShotId[]).forEach((k) => (shotRt[k] = { img: null, state: "idle" }));
let shotsV = 0;
const shotListeners = new Set<() => void>();

/** Increments whenever a screenshot finishes loading (or fails) so canvases know to repaint. */
export const shotsVersion = () => shotsV;
export function onShotsChange(cb: () => void) {
  shotListeners.add(cb);
  return () => void shotListeners.delete(cb);
}

function shot(id: ShotId): ShotRt {
  const r = shotRt[id];
  if (r.state === "idle" && typeof Image !== "undefined") {
    r.state = "loading";
    const img = new Image();
    img.decoding = "async";
    const done = (state: "ready" | "error") => {
      r.state = state;
      shotsV++;
      shotListeners.forEach((cb) => cb());
    };
    img.onload = () => done("ready");
    img.onerror = () => done("error");
    img.src = SHOT_SRC[id];
    r.img = img;
  }
  return r;
}

/** Start loading every screenshot (call when a scene is created, so they are ready before the panels appear). */
export function preloadShots() {
  (Object.keys(SHOT_SRC) as ShotId[]).forEach(shot);
}

/** Draw an image to fill (x,y,w,h) with rounded corners, cropping overflow ("cover"), anchored to the top. */
function drawCover(g: G, img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / k;
  const sh = h / k;
  g.save();
  rr(g, x, y, w, h, r);
  g.clip();
  g.imageSmoothingQuality = "high";
  g.drawImage(img, (img.naturalWidth - sw) / 2, 0, sw, sh, x, y, w, h);
  g.restore();
}

function drawWindowShot(id: ShotId, fallback: (g: G, st: PanelState) => void, W: number, H: number) {
  return (g: G, st: PanelState) => {
    const r = shot(id);
    if (r.state === "error") return fallback(g, st);
    windowFrame(g, W, H, 22);
    if (r.state === "ready" && r.img) drawCover(g, r.img, 8, 8, W - 16, H - 16, 16);
  };
}

/** A phone body (same chrome as the illustrative one) with a real app screenshot as its screen. */
function drawPhoneBody(g: G, id: ShotId, ox: number, oy: number, k: number) {
  const W = 520;
  const H = 1064;
  g.save();
  g.translate(ox, oy);
  g.scale(k, k);
  box(g, 3, 3, W - 6, H - 6, 74, "#05080f", "rgba(150,185,255,0.55)", 5);
  box(g, 18, 18, W - 36, H - 36, 60, "#f4f7fc");
  const r = shot(id);
  if (r.state === "ready" && r.img) drawCover(g, r.img, 18, 18, W - 36, H - 36, 60);
  box(g, W / 2 - 54, 34, 108, 30, 15, "#02040a");
  g.restore();
}

function drawPhoneShot(id: ShotId) {
  return (g: G, st: PanelState) => {
    if (shot(id).state === "error") return drawPhone(g, st);
    drawPhoneBody(g, id, 0, 0, 1);
  };
}

function drawCardShot(id: ShotId, idx: number) {
  return (g: G, st: PanelState) => {
    if (shot(id).state === "error") return drawVariant(idx)(g, st);
    const W = 840;
    const H = 1040;
    windowFrame(g, W, H, 40);
    const k = (H - 40) / 1064;
    drawPhoneBody(g, id, (W - 520 * k) / 2, 20, k);
  };
}

/* ─────────────────────────────── registry ─────────────────────────────── */

export type PanelSpec = {
  /** Design (logical) size; the texture is this × quality. */
  w: number;
  h: number;
  /** Redraw rate while visible. */
  fps: number;
  draw: (g: G, st: PanelState) => void;
};

export const PANEL_SPECS: Record<PanelId, PanelSpec> = {
  dash: { w: 1280, h: 620, fps: 8, draw: drawWindowShot("dash", drawDash, 1280, 620) },
  phone: { w: 520, h: 1064, fps: 8, draw: drawPhoneShot("app3") },
  sales: { w: 760, h: 366, fps: 8, draw: drawWindowShot("tour", drawSales, 760, 366) },
  flow: { w: 920, h: 420, fps: 12, draw: drawFlow },
  map: { w: 720, h: 540, fps: 12, draw: drawMap },
  notif: { w: 600, h: 248, fps: 10, draw: drawNotif },
  v1: { w: 840, h: 1040, fps: 8, draw: drawCardShot("app1", 0) },
  v2: { w: 840, h: 1040, fps: 8, draw: drawCardShot("app2", 1) },
  v3: { w: 840, h: 1040, fps: 8, draw: drawCardShot("app3", 2) },
};
