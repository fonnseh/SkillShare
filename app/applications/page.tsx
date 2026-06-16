"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Send, MapPin, Clock, Trash2, ExternalLink, Filter } from "lucide-react";
import { getStatusBadge, getStatusLabel, formatSalary, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_TABS = ["ALL", "PENDING", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"];

async function fetchApplications(status: string) {
  const qs = status !== "ALL" ? `?status=${status}` : "";
  const res = await fetch(`/api/applications${qs}`);
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data?.applications || []);
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications", activeTab],
    queryFn: () => fetchApplications(activeTab),
  });

  const { mutate: withdraw } = useMutation({
    mutationFn: (id: string) => fetch(`/api/applications/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => { toast.success("Application withdrawn"); queryClient.invalidateQueries({ queryKey: ["applications"] }); },
    onError: () => toast.error("Failed to withdraw"),
  });

  const counts: Record<string, number> = { ALL: applications.length };

  return (
    <div className="page-container">
      <Sidebar role="JOB_SEEKER" />
      <div className="main-content">
        <TopBar title="My Applications" subtitle="Track all your job applications" />
        <div className="content-area">
          {/* Status Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab ? "bg-blue-600 text-white" : "bg-[#161b22] border border-[#21262d] text-slate-400 hover:text-white hover:border-[#30363d]"
                }`}
              >
                {tab === "ALL" ? "All" : getStatusLabel(tab)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20">
              <Send className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No applications yet</h3>
              <p className="text-slate-400 text-sm mb-4">Start applying to jobs to track them here</p>
              <Link href="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app: any, i: number) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card-dark p-5 hover:border-blue-500/20 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {app.job.company.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-white font-semibold">{app.job.title}</h3>
                            <p className="text-slate-400 text-sm">{app.job.company.name}</p>
                          </div>
                          <span className={`badge text-xs flex-shrink-0 ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                          {app.job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Applied {timeAgo(app.appliedAt)}</span>
                          <span className="text-blue-400">{formatSalary(app.job.salaryMin, app.job.salaryMax, app.job.salaryCurrency)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {app.job.skills?.slice(0, 3).map((s: any) => (
                            <span key={s.skillId} className="badge bg-[#21262d] text-slate-400 text-xs">{s.skill?.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/jobs/${app.jobId}`} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {app.status === "PENDING" && (
                        <button
                          onClick={() => { if (confirm("Withdraw this application?")) withdraw(app.id); }}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
