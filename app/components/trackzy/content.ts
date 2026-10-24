/**
 * Trackzy marketing content — the single place to edit what the website claims about the product.
 *
 * `confirmed: false` modules are NOT rendered anywhere (neither in the page copy nor in the 3D panels).
 * Flip a flag to `true` only once the feature is verified in the Trackzy codebase / production product.
 */
export type TrackzyModule = {
  id: string;
  title: string;
  description: string;
  confirmed: boolean;
};

export const TRACKZY_MODULES: TrackzyModule[] = [
  { id: "overview", title: "Admin dashboard", description: "A business overview for owners and managers — sales, team activity and key numbers in one place.", confirmed: true },
  { id: "team", title: "Employee management", description: "Manage your field and office teams, their roles and their daily work from a single admin panel.", confirmed: true },
  { id: "attendance", title: "Attendance & daily activity", description: "See who has checked in and what each team member has done during the day.", confirmed: true },
  { id: "tracking", title: "Location tracking & visit history", description: "Follow field visits on a map and review visit history for every team member.", confirmed: true },
  { id: "sales", title: "Sales orders & entries", description: "Capture orders and sales entries from the employee mobile app straight into your records.", confirmed: true },
  { id: "followups", title: "Follow-ups & notifications", description: "Keep follow-ups on schedule so no lead or customer conversation slips through.", confirmed: true },
  { id: "analytics", title: "Targets, analytics & reports", description: "Set sales targets and review analytics and reports that show how the business is performing.", confirmed: true },
  { id: "custom", title: "Customizable modules", description: "IT-HUNKS tailors modules and workflows to the way your business actually runs.", confirmed: true },
  // Not yet verified against the product — hidden until confirmed.
  { id: "finance", title: "Financial & receivables workflows", description: "Track payments and receivables alongside sales.", confirmed: false },
  { id: "industry-visits", title: "Doctor / dealer / farmer visit workflows", description: "Visit workflows configured for your industry.", confirmed: false },
];

export const confirmedModules = () => TRACKZY_MODULES.filter((m) => m.confirmed);

export const TRACKZY_COPY = {
  label: "INTRODUCING TRACKZY",
  statement: "One connected platform. Your entire business.",
  description:
    "Track sales, manage teams, streamline operations, and bring your business workflows together with Trackzy — our customizable ERP and CRM platform.",
  primaryCta: "Explore Trackzy",
  secondaryCta: "Build Your Solution",
  customizeLine: "Your business. Your workflows. Your Trackzy.",
  previewNote: "Interface previews are illustrative and use sample data.",
};

/** Story captions, in scroll order. Stage index matches STAGES in layout.ts. */
export const STORY_CAPTIONS = [
  { stage: 0, eyebrow: "One platform", title: "Connected operations", body: "Sales, teams and day-to-day work live in one platform instead of scattered tools and spreadsheets." },
  { stage: 1, eyebrow: "Visibility & control", title: "See the whole business", body: "An admin dashboard for business overview, analytics, team activity and reporting." },
  { stage: 2, eyebrow: "Business in motion", title: "Your team, in the field", body: "A mobile app for employees — attendance, visits, location and daily activity, connected to the admin side." },
  { stage: 3, eyebrow: "Sales & workflows", title: "From entry to insight", body: "A visit or sales entry made in the field flows through to the reports and dashboards your managers use." },
  { stage: 4, eyebrow: "Made for you", title: "Your business. Your workflows. Your Trackzy.", body: "IT-HUNKS customizes Trackzy’s modules and workflows around your business requirements." },
] as const;
