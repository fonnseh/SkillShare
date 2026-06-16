"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { toast } from "sonner";
import { Loader2, Plus, X, Sparkles } from "lucide-react";

const postJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"]),
  level: z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryCurrency: z.string().default("USD"),
  deadline: z.string().optional(),
});

type PostJobForm = z.infer<typeof postJobSchema>;

export default function PostJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PostJobForm>({
    resolver: zodResolver(postJobSchema),
    defaultValues: { type: "FULL_TIME", level: "MID", salaryCurrency: "USD", isRemote: false },
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const onSubmit = async (data: PostJobForm) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          skills,
          salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
          salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Job posted successfully!");
      router.push("/my-jobs");
    } catch (err: any) {
      toast.error(err.message || "Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithAI = async () => {
    const title = watch("title");
    if (!title) { toast.error("Enter a job title first"); return; }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai?action=generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, skills, level: watch("level"), type: watch("type"), location: watch("location"), company: "" }),
      });
      const json = await res.json();
      if (json.data) {
        if (json.data.description) setValue("description", json.data.description);
        if (json.data.responsibilities) setValue("responsibilities", json.data.responsibilities.join("\n"));
        if (json.data.requirements) setValue("requirements", json.data.requirements.join("\n"));
        if (json.data.benefits) setValue("benefits", json.data.benefits.join("\n"));
        toast.success("AI generated job description!");
      }
    } catch { toast.error("AI generation failed"); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="page-container">
      <Sidebar role="EMPLOYER" />
      <div className="main-content">
        <TopBar title="Post a New Job" subtitle="Create a job listing to find the best candidates" />
        <div className="content-area">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="card-dark p-6">
                  <h3 className="text-white font-semibold mb-5">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Job Title *</label>
                      <input {...register("title")} placeholder="e.g. Frontend Developer" className="input-dark" />
                      {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm text-slate-300 font-medium">Job Description *</label>
                        <button
                          type="button"
                          onClick={generateWithAI}
                          disabled={isGenerating}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          AI Generate
                        </button>
                      </div>
                      <textarea
                        {...register("description")}
                        placeholder="Describe the role, responsibilities and what makes this opportunity exciting..."
                        rows={5}
                        className="input-dark resize-none"
                      />
                      {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Requirements</label>
                      <textarea {...register("requirements")} placeholder="List the key requirements (one per line)" rows={4} className="input-dark resize-none" />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Responsibilities</label>
                      <textarea {...register("responsibilities")} placeholder="Key responsibilities (one per line)" rows={4} className="input-dark resize-none" />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Benefits</label>
                      <textarea {...register("benefits")} placeholder="e.g. Health insurance, Remote work, Learning budget" rows={3} className="input-dark resize-none" />
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="card-dark p-6">
                  <h3 className="text-white font-semibold mb-5">Job Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Job Type</label>
                      <select {...register("type")} className="input-dark">
                        {[["FULL_TIME", "Full-time"], ["PART_TIME", "Part-time"], ["CONTRACT", "Contract"], ["INTERNSHIP", "Internship"], ["FREELANCE", "Freelance"], ["REMOTE", "Remote"]].map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Experience Level</label>
                      <select {...register("level")} className="input-dark">
                        {[["ENTRY", "Entry Level"], ["JUNIOR", "Junior"], ["MID", "Mid Level"], ["SENIOR", "Senior"], ["LEAD", "Lead"], ["EXECUTIVE", "Executive"]].map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Location</label>
                      <input {...register("location")} placeholder="e.g. Lagos, Nigeria" className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Application Deadline</label>
                      <input {...register("deadline")} type="date" className="input-dark" />
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <input {...register("isRemote")} type="checkbox" id="isRemote" className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600" />
                      <label htmlFor="isRemote" className="text-sm text-slate-300">This is a remote position</label>
                    </div>
                  </div>
                </div>

                {/* Salary */}
                <div className="card-dark p-6">
                  <h3 className="text-white font-semibold mb-5">Salary Range</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Currency</label>
                      <select {...register("salaryCurrency")} className="input-dark">
                        <option value="USD">USD ($)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Minimum Salary</label>
                      <input {...register("salaryMin")} type="number" placeholder="e.g. 5000" className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5 font-medium">Maximum Salary</label>
                      <input {...register("salaryMax")} type="number" placeholder="e.g. 8000" className="input-dark" />
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="card-dark p-6">
                  <h3 className="text-white font-semibold mb-5">Required Skills</h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="e.g. React, JavaScript, Tailwind CSS"
                      className="input-dark flex-1"
                    />
                    <button type="button" onClick={addSkill} className="btn-secondary flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill) => (
                        <span key={skill} className="flex items-center gap-1.5 badge-blue text-xs">
                          {skill}
                          <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Posting Job...</> : "Post Job"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
