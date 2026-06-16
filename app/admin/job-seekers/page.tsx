"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Users, Search, Loader2, MapPin } from "lucide-react";

interface U {
  id: string; name: string | null; email: string; createdAt: string;
  profile?: { location?: string }; _count?: { applications: number };
}

export default function AdminJobSeekersPage() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/users?role=JOB_SEEKER&limit=50")
      .then((r) => r.json())
      .then((d) => setUsers(d?.data?.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Job Seekers" subtitle="All registered candidates" />
        <div className="content-area">
          <div className="relative mb-5 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-dark w-full pl-9" placeholder="Search candidates..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-white font-semibold mb-1">No job seekers found</p>
              <p className="text-slate-400 text-sm">Candidates appear here once they register.</p>
            </div>
          ) : (
            <div className="card-dark overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#21262d] text-slate-400 text-left">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Applications</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-[#21262d]/50 hover:bg-[#161b22]">
                      <td className="px-5 py-3 text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                            {u.name?.charAt(0) || "U"}
                          </div>
                          {u.name || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{u.email}</td>
                      <td className="px-5 py-3 text-slate-400">
                        {u.profile?.location ? (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.profile.location}</span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3"><span className="badge badge-blue">{u._count?.applications ?? 0}</span></td>
                      <td className="px-5 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
