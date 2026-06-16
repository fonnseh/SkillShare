"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Clock, DollarSign, Users, Bookmark, Share2, ChevronLeft, Loader2, CheckCircle, Building2, Globe, Calendar } from "lucide-react";
import { formatSalary, getJobTypeLabel, getExperienceLabel, getMatchBg, timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

async function fetchJob(id: string) {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) throw new Error("Not found");
  return res.json().then((j) => j.data.job);
}

async function applyToJob(data: { jobId: string; coverLetter: string }) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);

  const { data: job, isLoading } = useQuery({ queryKey: ["job", id], queryFn: () => fetchJob(id) });

  const { mutate: apply, isPending } = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => { setApplied(true); setShowApplyForm(false); toast.success("Application submitted!"); },
    onError: (err: any) => toast.error(err.message || "Application failed"),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center"><h2 className="text-white text-xl font-bold mb-2">Job Not Found</h2>
        <Link href="/jobs" className="btn-primary">Browse Jobs</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/jobs" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {job.company?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-white font-bold text-2xl mb-1">{job.title}</h1>
                    <p className="text-slate-400">{job.company?.name}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-400">
                      {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>}
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{getJobTypeLabel(job.type)}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{job.applicationCount} applicants</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Posted {timeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills?.map((s: any) => <span key={s.skillId} className="badge-blue text-xs">{s.skill?.name}</span>)}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-dark p-6">
                <h2 className="text-white font-semibold text-lg mb-4">Job Description</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
              </motion.div>

              {job.responsibilities && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-dark p-6">
                  <h2 className="text-white font-semibold text-lg mb-4">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.split("\n").filter(Boolean).map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />{r.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {job.requirements && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-dark p-6">
                  <h2 className="text-white font-semibold text-lg mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.split("\n").filter(Boolean).map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />{r.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {job.benefits && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-dark p-6">
                  <h2 className="text-white font-semibold text-lg mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.split("\n").filter(Boolean).map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />{b.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Apply Form */}
              {showApplyForm && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6">
                  <h2 className="text-white font-semibold mb-4">Cover Letter (Optional)</h2>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit for this role..."
                    rows={6}
                    className="input-dark resize-none mb-4"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => apply({ jobId: job.id, coverLetter })} disabled={isPending} className="btn-primary flex items-center gap-2">
                      {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : "Submit Application"}
                    </button>
                    <button onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Apply Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-dark p-5">
                <div className="text-center mb-5">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                  </div>
                  <div className="text-slate-400 text-sm">{job.salaryPeriod}</div>
                </div>
                {applied ? (
                  <div className="flex items-center gap-2 justify-center py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                    <CheckCircle className="w-5 h-5" /> Application Submitted!
                  </div>
                ) : (
                  <button onClick={() => setShowApplyForm(true)} className="btn-primary w-full py-3 text-base">
                    Apply Now
                  </button>
                )}
                <button className="btn-secondary w-full py-2.5 mt-2 flex items-center justify-center gap-2">
                  <Bookmark className="w-4 h-4" /> Save Job
                </button>
              </motion.div>

              {/* Job Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card-dark p-5">
                <h3 className="text-white font-semibold mb-4">Job Overview</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Job Type", value: getJobTypeLabel(job.type) },
                    { label: "Experience", value: getExperienceLabel(job.level) },
                    { label: "Location", value: job.location || "Not specified" },
                    { label: "Remote", value: job.isRemote ? "Yes" : "No" },
                    { label: "Deadline", value: job.deadline ? new Date(job.deadline).toLocaleDateString() : "Open" },
                    { label: "Applications", value: `${job.applicationCount} received` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Company Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card-dark p-5">
                <h3 className="text-white font-semibold mb-4">About Company</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-white font-bold">
                    {job.company?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{job.company?.name}</div>
                    {job.company?.isVerified && <span className="badge-green text-xs">✓ Verified</span>}
                  </div>
                </div>
                {job.company?.description && <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-3">{job.company.description}</p>}
                <div className="space-y-1.5 text-xs text-slate-400">
                  {job.company?.industry && <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" />{job.company.industry}</div>}
                  {job.company?.size && <div className="flex items-center gap-1.5"><Users className="w-3 h-3" />{job.company.size} employees</div>}
                  {job.company?.website && (
                    <a href={job.company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:underline">
                      <Globe className="w-3 h-3" />{job.company.website}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
