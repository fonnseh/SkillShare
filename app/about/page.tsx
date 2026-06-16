import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Target, Users, Sparkles, Award, ArrowRight } from "lucide-react";

const values = [
  { icon: Target, title: "Skills over degrees", text: "We match people to opportunities based on what they can do, not just where they studied." },
  { icon: Sparkles, title: "AI-powered matching", text: "Our matching engine surfaces roles where candidates are most likely to thrive." },
  { icon: Users, title: "Built for everyone", text: "Job seekers, employers, recruiters, and students all have a place here." },
  { icon: Award, title: "Quality connections", text: "We focus on meaningful matches that lead to real outcomes, not noise." },
];

const stats = [
  { value: "10K+", label: "Active Jobs" },
  { value: "25K+", label: "Job Seekers" },
  { value: "5K+", label: "Companies" },
  { value: "98%", label: "Success Rate" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bridging skills to <span className="gradient-text">opportunities</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            SkillBridge is a modern career platform connecting talented individuals with top employers based on skills, not just credentials.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-blue-400">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {values.map((v) => (
            <div key={v.title} className="card-dark p-6">
              <div className="w-11 h-11 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-slate-400 text-sm">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="card-dark p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find your next opportunity?</h2>
          <p className="text-slate-400 mb-6">Join thousands building their careers on SkillBridge.</p>
          <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
