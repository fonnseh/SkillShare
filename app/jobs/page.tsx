"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, MapPin, Briefcase, Filter, X, Clock, DollarSign, Star, Bookmark, ExternalLink } from "lucide-react";
import { formatSalary, getMatchBg, getJobTypeLabel, getExperienceLabel, timeAgo } from "@/lib/utils";
import { JobType, ExperienceLevel } from "@/types";

async function fetchJobs(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/jobs?${qs}`);
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

const jobTypes: JobType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"];
const expLevels: ExperienceLevel[] = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const queryParams: Record<string, string> = { page: String(page), limit: "12" };
  if (search) queryParams.search = search;
  if (location) queryParams.location = location;
  if (selectedType.length === 1) queryParams.type = selectedType[0];
  if (selectedLevel.length === 1) queryParams.level = selectedLevel[0];

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", queryParams],
    queryFn: () => fetchJobs(queryParams),
  });

  const jobs = data?.jobs || [];
  const meta = data?.meta || {};

  const toggleFilter = (arr: string[], val: string, setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Search Hero */}
        <div className="bg-gradient-to-b from-[#0f2346] to-[#0d1117] py-12 px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Find Your Dream Job</h1>
            <p className="text-slate-400">Discover {meta.total || "10,000+"} opportunities matched to your skills</p>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, skills, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark pl-12 py-3.5 text-base"
              />
            </div>
            <div className="relative sm:w-56">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="All Locations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-dark pl-12 py-3.5 text-base"
              />
            </div>
            <button className="btn-primary px-8 py-3.5 flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="card-dark p-5 sticky top-20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
                  {(selectedType.length > 0 || selectedLevel.length > 0) && (
                    <button
                      onClick={() => { setSelectedType([]); setSelectedLevel([]); }}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h4 className="text-slate-300 text-sm font-medium mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedType.includes(type)}
                          onChange={() => toggleFilter(selectedType, type, setSelectedType)}
                          className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600"
                        />
                        <span className="text-slate-400 text-sm">{getJobTypeLabel(type)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <h4 className="text-slate-300 text-sm font-medium mb-3">Experience Level</h4>
                  <div className="space-y-2">
                    {expLevels.map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLevel.includes(level)}
                          onChange={() => toggleFilter(selectedLevel, level, setSelectedLevel)}
                          className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600"
                        />
                        <span className="text-slate-400 text-sm">{getExperienceLabel(level)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Remote */}
                <div>
                  <h4 className="text-slate-300 text-sm font-medium mb-3">Work Mode</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600" />
                    <span className="text-slate-400 text-sm">Remote Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm">
                  {isLoading ? "Loading..." : `${meta.total || 0} jobs found`}
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-52 rounded-xl" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No jobs found</h3>
                  <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job: any, i: number) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="flex items-center text-slate-400 text-sm px-4">
                    Page {page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <div className="card-dark p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {job.company?.name?.charAt(0) || "?"}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{job.company?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {job.matchScore && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getMatchBg(job.matchScore)}`}>
              {job.matchScore}%
            </span>
          )}
          {job.isFeatured && (
            <span className="badge-yellow text-xs">Featured</span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills?.slice(0, 3).map((s: any) => (
          <span key={s.skillId} className="badge-blue text-xs">{s.skill?.name}</span>
        ))}
        {job.skills?.length > 3 && (
          <span className="badge bg-[#30363d] text-slate-400 text-xs">+{job.skills.length - 3}</span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getJobTypeLabel(job.type)}</span>
        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{getExperienceLabel(job.level)}</span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#21262d]">
        <span className="text-blue-400 font-semibold text-sm">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
        </span>
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-500 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-500/10">
            <Bookmark className="w-4 h-4" />
          </button>
          <Link
            href={`/jobs/${job.id}`}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
