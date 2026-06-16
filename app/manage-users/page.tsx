"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Search, UserCheck, UserX, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

async function fetchUsers(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/users?${qs}`);
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

async function updateUser(id: string, action: string) {
  const res = await fetch(`/api/users?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const params: Record<string, string> = { page: String(page), limit: "10" };
  if (search) params.search = search;
  if (roleFilter) params.role = roleFilter;
  if (statusFilter) params.status = statusFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => updateUser(id, action),
    onSuccess: (_, { action }) => {
      toast.success(action === "delete" ? "User deleted" : action === "suspend" ? "User suspended" : "User activated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Action failed"),
  });

  const users = data?.users || [];
  const meta = data?.meta || {};

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return "bg-red-500/20 text-red-400 border border-red-500/30";
    if (role === "EMPLOYER") return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  };

  return (
    <div className="page-container">
      <Sidebar role="ADMIN" />
      <div className="main-content">
        <TopBar title="Manage Users" subtitle={`Total ${meta.total?.toLocaleString() || 0} users`} />
        <div className="content-area">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="input-dark pl-9"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="input-dark w-40"
              >
                <option value="">All Roles</option>
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-dark w-40"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Table */}
            <div className="card-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#21262d] bg-[#161b22]">
                      {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#21262d]">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="skeleton h-4 rounded" /></td></tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No users found</td></tr>
                    ) : (
                      users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-[#161b22]/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                                {user.name?.charAt(0) || "?"}
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.name || "—"}</div>
                                {user.profile?.location && (
                                  <div className="text-slate-500 text-xs">{user.profile.location}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-400">{user.email}</td>
                          <td className="px-5 py-4">
                            <span className={`badge text-xs ${getRoleBadge(user.role)}`}>
                              {user.role === "JOB_SEEKER" ? "Job Seeker" : user.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {user.isSuspended ? (
                              <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 text-xs">Suspended</span>
                            ) : (
                              <span className="badge bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Active</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-slate-400 text-xs">{timeAgo(user.createdAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {user.isSuspended ? (
                                <button
                                  onClick={() => mutation.mutate({ id: user.id, action: "activate" })}
                                  className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                  title="Activate"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => mutation.mutate({ id: user.id, action: "suspend" })}
                                  className="p-1.5 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                  title="Suspend"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Delete this user? This cannot be undone.")) {
                                    mutation.mutate({ id: user.id, action: "delete" });
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#21262d]">
                  <p className="text-slate-400 text-xs">
                    Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of {meta.total}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-secondary p-2 disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPage((p) => p + 1)} disabled={page === meta.totalPages} className="btn-secondary p-2 disabled:opacity-40">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
