"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Bell, Check, CheckCheck, Briefcase, MessageSquare, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Notif {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const iconFor = (type: string) => {
  if (type?.includes("JOB") || type?.includes("APPLICATION")) return Briefcase;
  if (type?.includes("MESSAGE")) return MessageSquare;
  if (type?.includes("INTERVIEW")) return UserCheck;
  return Bell;
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifs(d?.data?.notifications || []))
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifs((n) => n.map((x) => ({ ...x, isRead: true })));
    toast.success("All marked as read");
  }

  async function markOne(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifs((n) => n.map((x) => (x.id === id ? { ...x, isRead: true } : x)));
  }

  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Notifications" subtitle={unread ? `${unread} unread` : "You're all caught up"} />
        <div className="content-area max-w-2xl">
          {unread > 0 && (
            <button onClick={markAll} className="btn-secondary inline-flex items-center gap-2 mb-4 text-sm">
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          )}

          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : notifs.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-white text-lg font-semibold mb-1">No notifications</h2>
              <p className="text-slate-400">Updates about jobs, applications, and messages appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifs.map((n) => {
                const Icon = iconFor(n.type);
                return (
                  <div
                    key={n.id}
                    className={`card-dark p-4 flex items-start gap-3 ${!n.isRead ? "border-l-2 border-l-blue-500" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{n.title}</p>
                      <p className="text-slate-400 text-sm">{n.message}</p>
                      <p className="text-slate-600 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    {!n.isRead && (
                      <button onClick={() => markOne(n.id)} className="text-slate-500 hover:text-blue-400 p-1" title="Mark read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
