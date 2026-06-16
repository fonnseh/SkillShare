"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Briefcase, Users, Calendar, UserCheck, PlusCircle, ArrowRight, Building2 } from "lucide-react";
import { timeAgo, getStatusBadge, getStatusLabel } from "@/lib/utils";

async function fetchEmployerStats() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

async function fetchRecentApplicants() {
  const res = await fetch("/api/applications?limit=5");
  if (!res.ok) return [];
  return res.json().then((j) => j.data?.applications || []);
}

export default function EmployerDashboard() {
  const { data: session } = useSession();
  const { data: stats, isLoading } = useQuery({ queryKey: ["stats", "employer"], queryFn: fetchEmployerStats });
  const { data: applicants = [] } = useQuery({ queryKey: ["applicants", "recent"], queryFn: fetchRecentApplicants });

  const cards = [
    { label: "Active Jobs", value: stats?.activeJobs ?? 0, icon: Briefcase, color: "blue" as const, delta: "View all jobs" },
    { label: "Total Applicants", value: stats?.totalApplicants ?? 0, icon: Users, color: "cyan" as const, delta: "Review candidates" },
    { label: "Interviews", value: stats?.interviews ?? 0, icon: Calendar, color: "purple" as const, delta: "Upcoming" },
    { label: "Hired", value: stats?.hired ?? 0, icon: UserCheck, color: "green" as const, delta: "This month" },
  ];

  return (
    <div className="page-container">
      <Sidebar role="EMPLOYER" />
      <div className="main-content">
        <TopBar
          title="Employer Dashboard"
          subtitle={`Welcome back, ${session?.user?.name?.split(" ")[0]}! 👋`}
        />
        <div className="content-area">
          {/* Post Job CTA */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 mb-6 rounded-xl bg-blue-600/10 border border-blue-500/20"
          >
            <div>
              <h4 className="text-white font-semibold">Ready to find your next hire?</h4>
              <p className="text-slate-400 text-sm">Post a job and reach 25K+ skilled candidates</p>
            </div>
            <Link href="/post-job" className="btn-primary flex items-center gap-2 flex-shrink-0">
              <PlusCircle className="w-4 h-4" /> Post New Job
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {cards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <StatCard {...card} isLoading={isLoading} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applicants */}
            <div className="lg:col-span-2 card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold">Recent Applicants</h3>
                <Link href="/applicants" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {applicants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No applicants yet.</p>
                  <Link href="/post-job" className="btn-primary text-sm inline-block mt-3">Post a Job</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applicants.map((app: any) => (
                    <div key={app.id} className="flex items-center gap-4 p-3 bg-[#21262d] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">
                        {app.user?.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{app.user?.name}</div>
                        <div className="text-slate-400 text-xs">{app.job.title} • {timeAgo(app.appliedAt)}</div>
                      </div>
                      {app.matchScore && (
                        <span className="text-xs font-bold text-green-400 bg-green-500/20 border border-green-500/30 px-2 py-0.5 rounded-full">
                          {app.matchScore}% Match
                        </span>
                      )}
                      <span className={`badge text-xs ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span>
                      <Link href={`/applicants?id=${app.id}`} className="text-xs text-blue-400 hover:underline flex-shrink-0">
                        View Profile
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="card-dark p-6">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { href: "/post-job", icon: PlusCircle, label: "Post New Job", color: "text-blue-400" },
                    { href: "/applicants", icon: Users, label: "View Applicants", color: "text-green-400" },
                    { href: "/my-jobs", icon: Briefcase, label: "Manage Jobs", color: "text-purple-400" },
                    { href: "/company-profile", icon: Building2, label: "Edit Company Profile", color: "text-yellow-400" },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#21262d] hover:bg-[#2d333b] transition-colors"
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                      <span className="text-white text-sm">{action.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card-dark p-5">
                <h4 className="text-white font-semibold mb-3 text-sm">Hiring Tips</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex gap-2"><span className="text-blue-400">→</span> Add detailed job descriptions to get 3x more applications</li>
                  <li className="flex gap-2"><span className="text-blue-400">→</span> Respond to candidates within 48 hours</li>
                  <li className="flex gap-2"><span className="text-blue-400">→</span> Use skill tags for better AI matching</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
