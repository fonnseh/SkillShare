"use client";

import { LucideIcon, Loader2, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getStatusBadge, getStatusLabel, formatSalary, timeAgo, getMatchBg } from "@/lib/utils";

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "yellow" | "red" | "cyan";
  delta?: string;
  isLoading?: boolean;
}

const colorMap = {
  blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
  green: { icon: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "shadow-green-500/10" },
  purple: { icon: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
  yellow: { icon: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", glow: "shadow-yellow-500/10" },
  red: { icon: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "shadow-red-500/10" },
  cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "shadow-cyan-500/10" },
};

export function StatCard({ label, value, icon: Icon, color, delta, isLoading }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`card-dark p-5 hover:shadow-lg ${colors.glow} transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      {isLoading ? (
        <div className="skeleton h-8 w-20 rounded mb-2" />
      ) : (
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
      )}
      <div className="text-slate-400 text-sm">{label}</div>
      {delta && <div className={`text-xs mt-1 ${colors.icon}`}>{delta}</div>}
    </div>
  );
}

// ── Recent Applications ───────────────────────────────────────────────────────
async function fetchApplications() {
  const res = await fetch("/api/applications?limit=5");
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data?.applications || []);
}

export function RecentApplications() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications", "recent"],
    queryFn: fetchApplications,
  });

  return (
    <div className="card-dark p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold">My Applications</h3>
        <Link href="/applications" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No applications yet.</p>
          <Link href="/jobs" className="btn-primary text-sm inline-block mt-3">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app: any) => (
            <div key={app.id} className="flex items-center gap-4 p-3 bg-[#21262d] rounded-xl hover:bg-[#2d333b] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {app.job.company.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{app.job.title}</div>
                <div className="text-slate-400 text-xs">{app.job.company.name} • {timeAgo(app.appliedAt)}</div>
              </div>
              <span className={`badge text-xs flex-shrink-0 ${getStatusBadge(app.status)}`}>
                {getStatusLabel(app.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Recommended Jobs Widget ───────────────────────────────────────────────────
async function fetchRecommendations() {
  const res = await fetch("/api/ai?action=recommendations", { method: "POST", body: JSON.stringify({}) });
  if (!res.ok) return [];
  return res.json().then((j) => j.data?.recommendations?.slice(0, 4) || []);
}

export function RecommendedJobsWidget() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["recommendations", "widget"],
    queryFn: async () => {
      const res = await fetch("/api/ai?action=recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) return [];
      const j = await res.json();
      return j.data?.recommendations?.slice(0, 4) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="card-dark p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold">AI Recommendations</h3>
        <Link href="/recommendations" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job: any) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-3 p-3 bg-[#21262d] rounded-xl hover:bg-[#2d333b] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {job.company?.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium truncate group-hover:text-blue-400 transition-colors">{job.title}</div>
                <div className="text-slate-500 text-xs truncate">{job.company?.name}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getMatchBg(job.matchScore || 0)}`}>
                {job.matchScore}%
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Profile Strength Widget ───────────────────────────────────────────────────
const profileSteps = [
  { label: "Add photo", points: 10 },
  { label: "Add headline", points: 10 },
  { label: "Add skills", points: 20 },
  { label: "Add experience", points: 20 },
  { label: "Add education", points: 15 },
  { label: "Upload resume", points: 15 },
  { label: "Add projects", points: 10 },
];

export function ProfileStrengthWidget({ strength }: { strength: number }) {
  const color = strength >= 80 ? "#22c55e" : strength >= 60 ? "#3b82f6" : strength >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="card-dark p-6">
      <h3 className="text-white font-semibold mb-4">Profile Strength</h3>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#21262d" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="40" fill="none"
              stroke={color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - strength / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{strength}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {profileSteps.map((step) => (
          <div key={step.label} className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{step.label}</span>
            <span className="text-slate-500">+{step.points}pts</span>
          </div>
        ))}
      </div>

      <Link href="/profile" className="btn-primary w-full text-center text-sm mt-4 block py-2">
        Complete Profile
      </Link>
    </div>
  );
}
