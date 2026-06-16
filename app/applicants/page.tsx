"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Users, Search, Eye, UserCheck, UserX, Calendar, MessageSquare } from "lucide-react";
import { getStatusBadge, getStatusLabel, getMatchBg, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

const ACTIONS = [
  { label: "Shortlist", value: "SHORTLISTED", color: "text-purple-400 hover:bg-purple-500/10" },
  { label: "Interview", value: "INTERVIEW_SCHEDULED", color: "text-cyan-400 hover:bg-cyan-500/10" },
  { label: "Hire", value: "HIRED", color: "text-green-400 hover:bg-green-500/10" },
  { label: "Reject", value: "REJECTED", color: "text-red-400 hover:bg-red-500/10" },
];

async function fetchApplicants(status: string) {
  const qs = status !== "ALL" ? `?status=${status}` : "";
  const res = await fetch(`/api/applications${qs}`);
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data?.applications || []);
}

export default function ApplicantsPage() {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["applicants", activeStatus],
    queryFn: () => fetchApplicants(activeStatus),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).then((r) => r.json()),
    onSuccess: () => { toast.success("Status updated"); queryClient.invalidateQueries({ queryKey: ["applicants"] }); },
    onError: () => toast.error("Failed to update"),
  });

  const filtered = applicants.filter((a: any) =>
    !search || a.user?.name?.toLowerCase().includes(search.toLowerCase()) || a.job?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const STATUS_TABS = ["ALL", "PENDING", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"];

  return (
    <div className="page-container">
      <Sidebar role="EMPLOYER" />
      <div className="main-content">
        <TopBar title="Applicants" subtitle={`Total ${filtered.length} candidates`} />
        <div className="content-area">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicants..." className="input-dark pl-9" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {STATUS_TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveStatus(tab)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeStatus === tab ? "bg-blue-600 text-white" : "bg-[#161b22] border border-[#21262d] text-slate-400 hover:text-white"}`}
                >
                  {tab === "ALL" ? "All" : getStatusLabel(tab)}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No applicants found</h3>
              <p className="text-slate-400 text-sm">Post a job to start receiving applications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app: any, i: number) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="card-dark p-5 hover:border-blue-500/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                      {app.user?.name?.charAt(0) || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold">{app.user?.name}</h3>
                        {app.matchScore && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getMatchBg(app.matchScore)}`}>{app.matchScore}% Match</span>
                        )}
                        <span className={`badge text-xs ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span>
                      </div>
                      <p className="text-slate-400 text-sm">Applied for <span className="text-blue-400">{app.job?.title}</span></p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                        <span>{app.user?.profile?.location || "Location N/A"}</span>
                        <span>Applied {timeAgo(app.appliedAt)}</span>
                        {app.user?.profile?.headline && <span className="truncate max-w-48">{app.user.profile.headline}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ACTIONS.map((action) => (
                        <button key={action.value} onClick={() => updateStatus({ id: app.id, status: action.value })}
                          title={action.label}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent hover:border-current ${action.color} ${app.status === action.value ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={app.status === action.value}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
