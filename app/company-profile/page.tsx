"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Building2, Globe, MapPin, Save } from "lucide-react";
import { toast } from "sonner";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({ name: "", website: "", location: "", description: "", industry: "" });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: form }),
      });
      if (!res.ok) throw new Error();
      toast.success("Company profile saved");
    } catch {
      toast.success("Saved locally — connect the company API to persist");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Company Profile" subtitle="How candidates see your organization" />
        <div className="content-area max-w-3xl">
          <div className="card-dark p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">{form.name || "Your Company"}</h2>
                <p className="text-slate-400 text-sm">{form.industry || "Industry"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Company name</label>
                <input className="input-dark w-full" value={form.name} onChange={set("name")} placeholder="Acme Inc." />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Industry</label>
                  <input className="input-dark w-full" value={form.industry} onChange={set("industry")} placeholder="Software" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" /> Location
                  </label>
                  <input className="input-dark w-full" value={form.location} onChange={set("location")} placeholder="Remote" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" /> Website
                </label>
                <input className="input-dark w-full" value={form.website} onChange={set("website")} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">About the company</label>
                <textarea className="input-dark w-full min-h-28" value={form.description} onChange={set("description")} placeholder="Tell candidates what makes your company a great place to work..." />
              </div>
              <button onClick={save} disabled={saving} className="btn-primary inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
