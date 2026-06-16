import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

// ── Class Name Merger ────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date Formatters ──────────────────────────────────────────────────────────
export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: Date | string, fmt = "MMM d, yyyy") {
  return format(new Date(date), fmt);
}

// ── Salary Formatters ────────────────────────────────────────────────────────
export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "USD",
  period = "yearly"
) {
  if (!min && !max) return "Not disclosed";
  const fmt = (n: number) =>
    currency === "NGN"
      ? `₦${(n / 1000).toFixed(0)}K`
      : `$${(n / 1000).toFixed(0)}K`;
  const suffix = period === "monthly" ? "/mo" : "/yr";
  if (min && max) return `${fmt(min)} - ${fmt(max)}${suffix}`;
  if (min) return `From ${fmt(min)}${suffix}`;
  return `Up to ${fmt(max!)}${suffix}`;
}

// ── Match Score Color ─────────────────────────────────────────────────────────
export function getMatchColor(score: number) {
  if (score >= 90) return "text-green-400";
  if (score >= 75) return "text-blue-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

export function getMatchBg(score: number) {
  if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (score >= 75) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (score >= 60) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}

// ── Status Badge ──────────────────────────────────────────────────────────────
export function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    UNDER_REVIEW: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    SHORTLISTED: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    INTERVIEW_SCHEDULED: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    OFFER_EXTENDED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    HIRED: "bg-green-500/20 text-green-400 border border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border border-red-500/30",
    WITHDRAWN: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  };
  return map[status] || map["PENDING"];
}

export function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    OFFER_EXTENDED: "Offer Extended",
    HIRED: "Hired",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };
  return map[status] || status;
}

// ── Slug Generator ────────────────────────────────────────────────────────────
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + `-${Date.now()}`;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function getPaginationParams(searchParams: Record<string, string | undefined>) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// ── API Response Helpers ──────────────────────────────────────────────────────
export function apiSuccess(data: any, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

// ── Truncate ──────────────────────────────────────────────────────────────────
export function truncate(str: string, n = 100) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// ── Avatar Initials ───────────────────────────────────────────────────────────
export function getInitials(name?: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// ── Job Type Labels ───────────────────────────────────────────────────────────
export function getJobTypeLabel(type: string) {
  const map: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    REMOTE: "Remote",
  };
  return map[type] || type;
}

export function getExperienceLabel(level: string) {
  const map: Record<string, string> = {
    ENTRY: "Entry Level",
    JUNIOR: "Junior (1-2 yrs)",
    MID: "Mid Level (2-5 yrs)",
    SENIOR: "Senior (5+ yrs)",
    LEAD: "Lead / Principal",
    EXECUTIVE: "Executive",
  };
  return map[level] || level;
}
