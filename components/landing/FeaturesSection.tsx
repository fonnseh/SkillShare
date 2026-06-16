"use client";

import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Shield, Zap, Users, Search, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our AI analyzes your skills and experience to match you with the perfect opportunities — achieving up to 98% compatibility.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Target,
    title: "Skill-Based Hiring",
    description: "Employers focus on what you can do, not just your degree. Showcase your portfolio and projects to stand out.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Career Analytics",
    description: "Get detailed insights into your job search performance, skill gaps, and personalized career growth recommendations.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Verified Companies",
    description: "All employers on SkillBridge are verified and vetted. Apply with confidence knowing opportunities are legitimate.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: Zap,
    title: "Instant Applications",
    description: "Apply to multiple jobs with your SkillBridge profile. One-click applications save time and increase your chances.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: Award,
    title: "Skill Certifications",
    description: "Earn verified skill badges and certifications that employers trust, boosting your profile visibility by 3x.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Platform Features</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to
            <span className="gradient-text"> Succeed</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            SkillBridge provides a complete ecosystem for job seekers and employers to connect meaningfully.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`card-dark p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
