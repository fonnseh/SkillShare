"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { User, Bell, Lock, Globe, Trash2, LogOut, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, jobMatches: true, messages: true, marketing: false });

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Settings" subtitle="Manage your account and preferences" />
        <div className="content-area max-w-3xl">
          {/* Account */}
          <section className="card-dark p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold">Account</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
                <input className="input-dark w-full" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input className="input-dark w-full opacity-60 cursor-not-allowed" value={email} disabled />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed here.</p>
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-primary inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="card-dark p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold">Notifications</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: "email", label: "Email notifications" },
                { key: "jobMatches", label: "New job matches" },
                { key: "messages", label: "Direct messages" },
                { key: "marketing", label: "Product updates & tips" },
              ].map((row) => (
                <label key={row.key} className="flex items-center justify-between py-2 cursor-pointer">
                  <span className="text-slate-300 text-sm">{row.label}</span>
                  <button
                    type="button"
                    onClick={() => setNotifs((n) => ({ ...n, [row.key]: !n[row.key as keyof typeof n] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifs[row.key as keyof typeof notifs] ? "bg-blue-600" : "bg-[#30363d]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        notifs[row.key as keyof typeof notifs] ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="card-dark p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold">Security</h2>
            </div>
            <button className="btn-secondary inline-flex items-center gap-2" onClick={() => toast("Password reset flow coming soon")}>
              <Globe className="w-4 h-4" /> Change password
            </button>
          </section>

          {/* Danger zone */}
          <section className="card-dark p-6 border border-red-500/20">
            <h2 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger zone
            </h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary inline-flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
              <button
                onClick={() => toast.error("Account deletion must be confirmed by support")}
                className="px-4 py-2 rounded-lg bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20 transition-colors text-sm font-medium"
              >
                Delete account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
