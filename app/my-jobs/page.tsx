"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Briefcase, Plus, Users, Eye, Loader2 } from "lucide-react";

interface Job {
  id: string; title: string; status: string; location?: string; isRemote: boolean;
  createdAt: string; _count?: { applications: number };
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs?mine=true&limit=50")
      .then((r) => r.json())
      .then((d) => setJobs(d?.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Jobs" subtitle="Jobs your company has posted" />
        <div className="content-area">
          <div className="flex justify-end mb-5">
            <Link href="/post-job" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post new job
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-white text-lg font-semibold mb-2">No jobs posted yet</h2>
              <p className="text-slate-400 mb-6">Post your first job to start receiving applications.</p>
              <Link href="/post-job" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Post a job
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="card-dark p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{job.title}</h3>
                      <span className={`badge ${job.status === "ACTIVE" ? "badge-green" : "badge-yellow"}`}>{job.status}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{job.isRemote ? "Remote" : job.location || "—"} · Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-400 text-sm"><Users className="w-4 h-4" /> {job._count?.applications ?? 0}</span>
                    <Link href={`/jobs/${job.id}`} className="btn-secondary inline-flex items-center gap-1.5 text-sm">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
