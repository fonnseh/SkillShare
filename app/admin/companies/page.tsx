"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Building2, Search, Loader2, CheckCircle } from "lucide-react";

interface U {
  id: string; name: string | null; email: string; createdAt: string;
  company?: { name: string };
}

export default function AdminCompaniesPage() {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/users?role=EMPLOYER&limit=50")
      .then((r) => r.json())
      .then((d) => setUsers(d?.data?.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) => u.company?.name?.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Companies" subtitle="Registered employers on the platform" />
        <div className="content-area">
          <div className="relative mb-5 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-dark w-full pl-9" placeholder="Search companies..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-white font-semibold mb-1">No companies found</p>
              <p className="text-slate-400 text-sm">Employers appear here once they register.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((u) => (
                <div key={u.id} className="card-dark p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold truncate flex items-center gap-1">
                        {u.company?.name || u.name || "Company"}
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                      </h3>
                      <p className="text-slate-400 text-xs truncate">{u.email}</p>
                      <p className="text-slate-600 text-xs mt-2">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
