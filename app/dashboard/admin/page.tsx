"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { PlatformAnalyticsChart, ApplicationsBarChart, TopJobCategoriesChart } from "@/components/charts/ApplicationsChart";
import { Users, Building2, Briefcase, Send, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";

async function fetchAdminStats() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["stats", "admin"], queryFn: fetchAdminStats });

  const cards = [
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString() ?? "0", icon: Users, color: "blue" as const, delta: "+234 this month" },
    { label: "Companies", value: stats?.companies?.toLocaleString() ?? "0", icon: Building2, color: "green" as const, delta: "+12 this week" },
    { label: "Jobs Posted", value: stats?.jobsPosted?.toLocaleString() ?? "0", icon: Briefcase, color: "purple" as const, delta: "Active listings" },
    { label: "Applications", value: stats?.totalApplications?.toLocaleString() ?? "0", icon: Send, color: "yellow" as const, delta: "All time" },
  ];

  return (
    <div className="page-container">
      <Sidebar role="ADMIN" />
      <div className="main-content">
        <TopBar title="Admin Dashboard" subtitle="System overview and analytics" />
        <div className="content-area">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {cards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <StatCard {...card} isLoading={isLoading} />
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PlatformAnalyticsChart />
            </div>
            <TopJobCategoriesChart />
          </div>

          {/* Recent Users Table */}
          <div className="card-dark p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Recent Users</h3>
              <Link href="/manage-users" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                Manage all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-[#21262d]">
                    {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                      <th key={h} className="pb-3 text-slate-400 font-medium text-xs pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {isLoading ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading...</td></tr>
                  ) : stats?.recentUsers?.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">No users found</td></tr>
                  ) : (
                    (stats?.recentUsers || []).map((user: any) => (
                      <tr key={user.id} className="hover:bg-[#161b22] transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                              {user.name?.charAt(0) || "?"}
                            </div>
                            <span className="text-white">{user.name || "—"}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-400">{user.email}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge text-xs ${user.role === "ADMIN" ? "badge-red" : user.role === "EMPLOYER" ? "badge-purple" : "badge-blue"}`}>
                            {user.role === "JOB_SEEKER" ? "Job Seeker" : user.role === "EMPLOYER" ? "Employer" : "Admin"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {user.isSuspended ? (
                            <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3 h-3" /> Suspended</span>
                          ) : user.isActive ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-400 text-xs"><AlertCircle className="w-3 h-3" /> Inactive</span>
                          )}
                        </td>
                        <td className="py-3">
                          <Link href={`/manage-users?id=${user.id}`} className="text-blue-400 hover:text-blue-300 text-xs">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
