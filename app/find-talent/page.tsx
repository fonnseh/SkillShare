import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, Filter, UserCheck, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { icon: Search, title: "Search the talent pool", text: "Filter candidates by skills, experience level, and location." },
  { icon: Sparkles, title: "AI-ranked matches", text: "See applicants automatically ranked by fit for your roles." },
  { icon: UserCheck, title: "Connect & hire", text: "Message promising candidates and move them through your pipeline." },
];

export default function FindTalentPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find the right <span className="gradient-text">talent</span>, faster
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Post jobs, search a growing talent pool, and let AI surface the candidates most likely to succeed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2">
              Post a job <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/login" className="btn-secondary">Employer login</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {steps.map((s, i) => (
            <div key={s.title} className="card-dark p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-600 font-bold text-lg">{i + 1}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="card-dark p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-semibold">Ready to build your team?</p>
              <p className="text-slate-400 text-sm">Create an employer account to access the full hiring suite.</p>
            </div>
          </div>
          <Link href="/auth/register" className="btn-primary whitespace-nowrap">Get started</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
