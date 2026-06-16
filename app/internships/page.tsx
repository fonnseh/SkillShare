"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, MapPin, Building2, Clock, Loader2 } from "lucide-react";

interface Job {
  id: string; title: string; location?: string; isRemote: boolean;
  company?: { name: string }; createdAt: string;
}

export default function InternshipsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs?type=INTERNSHIP&limit=30")
      .then((r) => r.json())
      .then((d) => setJobs(d?.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 mb-4">
            <GraduationCap className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Internship Opportunities</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Kickstart your career. Browse internships from verified employers and apply in one click.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : jobs.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">No internships posted yet</h2>
            <p className="text-slate-400">Check back soon — new opportunities are added regularly.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card-dark-hover p-5 block">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="badge badge-purple mb-2 inline-block">Internship</span>
                    <h3 className="text-white font-semibold">{job.title}</h3>
                    <p className="text-slate-400 text-sm">{job.company?.name || "Company"}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.isRemote ? "Remote" : job.location || "—"}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
