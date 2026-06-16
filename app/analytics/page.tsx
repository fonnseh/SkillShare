"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { TrendingUp, Users, Briefcase, Target, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d?.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Briefcase, label: "Active Jobs", value: data?.activeJobs ?? data?.totalJobs ?? "—", color: "text-blue-400" },
    { icon: Users, label: "Total Applicants", value: data?.totalApplicants ?? data?.totalApplications ?? "—", color: "text-purple-400" },
    { icon: Target, label: "Interviews", value: data?.interviews ?? "—", color: "text-green-400" },
    { icon: TrendingUp, label: "Hired", value: data?.hired ?? data?.profileStrength ?? "—", color: "text-yellow-400" },
  ];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Analytics" subtitle="Platform performance at a glance" />
        <div className="content-area">
          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((c) => (
                  <div key={c.label} className="card-dark p-5">
                    <c.icon className={`w-5 h-5 ${c.color} mb-3`} />
                    <div className="text-2xl font-bold text-white">{c.value}</div>
                    <div className="text-slate-400 text-sm">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="card-dark p-6">
                <h2 className="text-white font-semibold mb-4">Activity over time</h2>
                <ApplicationsChart />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
