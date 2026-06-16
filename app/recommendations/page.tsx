"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Brain, MapPin, DollarSign, Bookmark, Sparkles, RefreshCw } from "lucide-react";
import { formatSalary, getMatchBg, getJobTypeLabel } from "@/lib/utils";

async function fetchRecommendations() {
  const res = await fetch("/api/ai?action=recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data?.recommendations || []);
}

export default function RecommendationsPage() {
  const { data: jobs = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: fetchRecommendations,
  });

  return (
    <div className="page-container">
      <Sidebar role="JOB_SEEKER" />
      <div className="main-content">
        <TopBar title="AI Job Recommendations" subtitle="Jobs matched to your skills" />
        <div className="content-area">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Personalized for You</h2>
                <p className="text-slate-400 text-xs">Updated in real-time based on your profile</p>
              </div>
            </div>
            <button onClick={() => refetch()} disabled={isFetching} className="btn-secondary flex items-center gap-2 text-sm">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-xl" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No recommendations yet</h3>
              <p className="text-slate-400 text-sm mb-4">Complete your profile to get AI-powered job matches</p>
              <Link href="/profile" className="btn-primary">Complete Profile</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job: any, i: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card-dark p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {job.company?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{job.title}</h3>
                        <p className="text-slate-400 text-sm">{job.company?.name}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${getMatchBg(job.matchScore)}`}>
                      {job.matchScore}% Match
                    </span>
                  </div>

                  {/* Match Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">AI Match Score</span>
                      <span className="text-white font-medium">{job.matchScore}%</span>
                    </div>
                    <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchScore}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full rounded-full ${job.matchScore >= 90 ? "bg-green-500" : job.matchScore >= 75 ? "bg-blue-500" : "bg-yellow-500"}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills?.slice(0, 4).map((s: any) => (
                      <span key={s.skillId} className="badge-blue text-xs">{s.skill?.name}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                    <span>{getJobTypeLabel(job.type)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
                    <span className="text-blue-400 font-semibold text-sm">
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-yellow-400 rounded-lg hover:bg-yellow-500/10 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <Link href={`/jobs/${job.id}`} className="btn-primary text-xs px-4 py-1.5">
                        View & Apply
                      </Link>
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
