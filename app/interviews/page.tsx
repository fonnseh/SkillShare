"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Calendar, Video, Clock } from "lucide-react";
import Link from "next/link";

export default function InterviewsPage() {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Interviews" subtitle="Your upcoming and past interviews" />
        <div className="content-area max-w-3xl">
          <div className="card-dark p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 mb-4">
              <Calendar className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-white text-lg font-semibold mb-2">No interviews scheduled</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              When an employer schedules an interview with you, it'll show up here with the date, time, and meeting link.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Track schedules</span>
              <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> Join calls</span>
            </div>
            <Link href="/applications" className="btn-primary inline-flex mt-8">View my applications</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
