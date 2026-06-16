import Link from "next/link";
import { Zap, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0f1a] border-t border-[#21262d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">SkillBridge</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting talented individuals with top employers based on skills, not just degrees. Build your future today.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-[#21262d] hover:bg-[#30363d] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "For Job Seekers", links: ["Browse Jobs", "Internships", "Career Advice", "Skill Assessments", "Resume Builder"] },
            { title: "For Employers", links: ["Post a Job", "Find Talent", "Pricing", "ATS Integration", "Success Stories"] },
            { title: "Company", links: ["About Us", "Blog", "Press", "Careers", "Contact Us"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Bottom */}
        <div className="border-t border-[#21262d] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@skillbridge.com</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +234 800 SKILLS</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lagos, Nigeria</span>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} SkillBridge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
