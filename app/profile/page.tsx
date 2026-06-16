"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { User, Briefcase, GraduationCap, Code2, Award, FolderOpen, Upload, Edit2, Save, X, Plus, Globe, Linkedin, Github } from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderOpen },
];

async function fetchProfile() {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed");
  return res.json().then((j) => j.data);
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const { register, handleSubmit, reset } = useForm();

  const { mutate: saveProfile } = useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => { toast.success("Profile updated!"); setEditing(false); queryClient.invalidateQueries({ queryKey: ["profile"] }); },
    onError: () => toast.error("Update failed"),
  });

  const profile = data?.profile;
  const user = data?.user;

  const strength = profile?.profileStrength || 0;
  const strengthColor = strength >= 80 ? "text-green-400" : strength >= 50 ? "text-blue-400" : "text-yellow-400";

  return (
    <div className="page-container">
      <Sidebar role="JOB_SEEKER" />
      <div className="main-content">
        <TopBar title="My Profile" subtitle="Complete your profile to get better matches" />
        <div className="content-area">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6 mb-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-600/30 border-2 border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-2xl flex-shrink-0">
                    {user?.name?.charAt(0) || "?"}
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-white font-bold text-xl">{user?.name || "Your Name"}</h2>
                      <p className="text-slate-400">{profile?.headline || "Add a headline"}</p>
                      {profile?.location && <p className="text-slate-500 text-sm mt-1">📍 {profile.location}</p>}
                    </div>
                    <button onClick={() => setEditing(!editing)} className={editing ? "btn-secondary flex items-center gap-1.5 text-sm" : "btn-primary flex items-center gap-1.5 text-sm"}>
                      {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                    </button>
                  </div>

                  {/* Profile strength */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-slate-400">Profile Strength</span>
                      <span className={`font-bold ${strengthColor}`}>{strength}%</span>
                    </div>
                    <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${strength >= 80 ? "bg-green-500" : strength >= 50 ? "bg-blue-500" : "bg-yellow-500"}`} style={{ width: `${strength}%` }} />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 mt-4">
                    {profile?.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Linkedin className="w-4 h-4" /></a>}
                    {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>}
                    {profile?.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Globe className="w-4 h-4" /></a>}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Edit Form */}
            {editing && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6 mb-6 border border-blue-500/20">
                <h3 className="text-white font-semibold mb-5">Edit Profile Information</h3>
                <form onSubmit={handleSubmit((d) => saveProfile(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                    <input {...register("name")} defaultValue={user?.name || ""} className="input-dark" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-300 mb-1.5">Professional Headline</label>
                    <input {...register("headline")} defaultValue={profile?.headline || ""} placeholder="e.g. Full Stack Developer | React & Node.js" className="input-dark" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-slate-300 mb-1.5">Bio</label>
                    <textarea {...register("bio")} defaultValue={profile?.bio || ""} rows={3} className="input-dark resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Phone</label>
                    <input {...register("phone")} defaultValue={profile?.phone || ""} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Location</label>
                    <input {...register("location")} defaultValue={profile?.location || ""} placeholder="City, Country" className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">LinkedIn URL</label>
                    <input {...register("linkedinUrl")} defaultValue={profile?.linkedinUrl || ""} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">GitHub URL</label>
                    <input {...register("githubUrl")} defaultValue={profile?.githubUrl || ""} className="input-dark" />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button type="submit" className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${activeTab === tab.id ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-slate-400 hover:text-white hover:bg-[#161b22]"}`}
                >
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {isLoading ? (
              <div className="skeleton h-48 rounded-xl" />
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {activeTab === "overview" && (
                  <div className="card-dark p-6">
                    <h3 className="text-white font-semibold mb-4">About</h3>
                    <p className="text-slate-400 leading-relaxed">{profile?.bio || "No bio added yet. Click Edit Profile to add one."}</p>
                    {profile?.skills?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-white font-medium mb-3">Top Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.slice(0, 8).map((s: any) => (
                            <span key={s.id} className="badge-blue">{s.skill.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="card-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-semibold">Technical Skills</h3>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Skill</button>
                    </div>
                    {profile?.skills?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {profile.skills.map((s: any) => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-[#21262d] rounded-xl">
                            <span className="text-white text-sm font-medium">{s.skill.name}</span>
                            <div className="flex items-center gap-2">
                              {s.level && <span className="text-slate-400 text-xs">{s.level}</span>}
                              {s.yearsExp && <span className="text-slate-500 text-xs">{s.yearsExp}y</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No skills added. Add your technical and soft skills to improve job matches.</p>
                    )}
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="card-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-semibold">Work Experience</h3>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Experience</button>
                    </div>
                    {profile?.experiences?.length > 0 ? (
                      <div className="space-y-5">
                        {profile.experiences.map((exp: any) => (
                          <div key={exp.id} className="flex gap-4 pb-5 border-b border-[#21262d] last:border-0 last:pb-0">
                            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{exp.title}</h4>
                              <p className="text-slate-400 text-sm">{exp.company} {exp.location && `• ${exp.location}`}</p>
                              <p className="text-slate-500 text-xs mt-1">
                                {new Date(exp.startDate).getFullYear()} – {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                              </p>
                              {exp.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{exp.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No experience added yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="card-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-semibold">Education</h3>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Education</button>
                    </div>
                    {profile?.educations?.length > 0 ? (
                      <div className="space-y-5">
                        {profile.educations.map((edu: any) => (
                          <div key={edu.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{edu.degree}</h4>
                              <p className="text-slate-400 text-sm">{edu.institution}</p>
                              <p className="text-slate-500 text-xs mt-1">{new Date(edu.startDate).getFullYear()} – {edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No education added yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="card-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-semibold">Projects</h3>
                      <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Project</button>
                    </div>
                    {profile?.projects?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.projects.map((project: any) => (
                          <div key={project.id} className="p-4 bg-[#21262d] rounded-xl">
                            <h4 className="text-white font-semibold mb-1">{project.name}</h4>
                            {project.description && <p className="text-slate-400 text-xs mb-3 line-clamp-2">{project.description}</p>}
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((t: string) => <span key={t} className="badge bg-[#30363d] text-slate-400 text-xs">{t}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-8">No projects added yet.</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
