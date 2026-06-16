"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Bookmark, MapPin, Building2, Briefcase, Loader2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  slug: string;
  location?: string;
  type: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  company?: { name: string; logoUrl?: string };
}

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs?saved=true&limit=20")
      .then((r) => r.json())
      .then((d) => setJobs(d?.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Saved Jobs" subtitle="Jobs you've bookmarked for later" />
        <div className="content-area">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-white text-lg font-semibold mb-2">No saved jobs yet</h2>
              <p className="text-slate-400 mb-6">Browse jobs and tap the bookmark icon to save them here.</p>
              <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Browse jobs
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="card-dark-hover p-5 block">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{job.title}</h3>
                      <p className="text-slate-400 text-sm">{job.company?.name || "Company"}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.isRemote ? "Remote" : job.location || "—"}
                        </span>
                        <span className="badge badge-blue">{job.type?.replace("_", " ")}</span>
                      </div>
                    </div>
                    <Bookmark className="w-5 h-5 text-blue-400 fill-blue-400 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
