"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { RecommendedJobsWidget } from "@/components/dashboard/RecommendedJobsWidget";
import { ProfileStrengthWidget } from "@/components/dashboard/ProfileStrengthWidget";
import { ApplicationsChart } from "@/components/charts/ApplicationsChart";
import { Send, Star, BookmarkCheck, TrendingUp, Loader2 } from "lucide-react";

async function fetchStats() {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed");
  const json = await res.json();
  return json.data;
}

export default function JobSeekerDashboard() {
  const { data: session } = useSession();
  const { data: stats, isLoading } = useQuery({ queryKey: ["stats", "seeker"], queryFn: fetchStats });

  const cards = [
    { label: "Applications", value: stats?.totalApplications ?? 0, icon: Send, color: "blue", delta: "+3 this week" },
    { label: "Interviews", value: stats?.interviews ?? 0, icon: TrendingUp, color: "green", delta: "2 upcoming" },
    { label: "Saved Jobs", value: stats?.savedJobs ?? 0, icon: BookmarkCheck, color: "purple", delta: "View all" },
    { label: "Profile Strength", value: `${stats?.profileStrength ?? 0}%`, icon: Star, color: "yellow", delta: "Complete profile" },
  ];

  return (
    <div className="page-container">
      <Sidebar role="JOB_SEEKER" />
      <div className="main-content">
        <TopBar title="Dashboard" subtitle={`Welcome back, ${session?.user?.name?.split(" ")[0]} 👋`} />
        <div className="content-area">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StatCard {...card} isLoading={isLoading} />
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Applications Chart + Recent */}
            <div className="lg:col-span-2 space-y-6">
              <ApplicationsChart />
              <RecentApplications />
            </div>
            {/* Right - Sidebar Widgets */}
            <div className="space-y-6">
              <ProfileStrengthWidget strength={stats?.profileStrength ?? 0} />
              <RecommendedJobsWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
