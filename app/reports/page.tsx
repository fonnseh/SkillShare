"use client";

import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PlatformAnalyticsChart, ApplicationsBarChart, TopJobCategoriesChart } from "@/components/charts/ApplicationsChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Briefcase, Send, Building2, TrendingUp, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const userRoleData = [
  { name: "Job Seekers", value: 75, color: "#3b82f6" },
  { name: "Employers", value: 20, color: "#a855f7" },
  { name: "Admins", value: 5, color: "#22c55e" },
];

const jobTypeData = [
  { name: "Full-time", value: 52, color: "#3b82f6" },
  { name: "Remote", value: 25, color: "#22c55e" },
  { name: "Contract", value: 13, color: "#f59e0b" },
  { name: "Internship", value: 10, color: "#a855f7" },
];

async function fetchStats() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

export default function ReportsPage() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });

  const cards = [
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString() ?? "0", icon: Users, color: "blue" as const },
    { label: "Companies", value: stats?.companies?.toLocaleString() ?? "0", icon: Building2, color: "green" as const },
    { label: "Jobs Posted", value: stats?.jobsPosted?.toLocaleString() ?? "0", icon: Briefcase, color: "purple" as const },
    { label: "Applications", value: stats?.totalApplications?.toLocaleString() ?? "0", icon: Send, color: "yellow" as const },
  ];

  return (
    <div className="page-container">
      <Sidebar role="ADMIN" />
      <div className="main-content">
        <TopBar title="Reports & Analytics" subtitle="Platform performance reports" />
        <div className="content-area">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {cards.map((card) => <StatCard key={card.label} {...card} isLoading={isLoading} />)}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2"><PlatformAnalyticsChart /></div>
            <TopJobCategoriesChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Applications Overview Bar Chart */}
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-1">Applications Overview</h3>
              <p className="text-slate-400 text-xs mb-4">Monthly application volume</p>
              <ApplicationsBarChart />
            </div>

            {/* User Role Distribution */}
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-5">User Distribution</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {userRoleData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Job Types Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-5">Job Types</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={jobTypeData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {jobTypeData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card-dark p-6">
              <h3 className="text-white font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Avg. Applications per Job", value: "14.2", trend: "+2.1" },
                  { label: "Profile Completion Rate", value: "68%", trend: "+5%" },
                  { label: "Employer Response Rate", value: "72%", trend: "+8%" },
                  { label: "Interview Conversion Rate", value: "31%", trend: "+3%" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{metric.value}</span>
                      <span className="text-green-400 text-xs">{metric.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
