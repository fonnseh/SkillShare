"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Building2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden animated-gradient">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-glow top-20 left-20 opacity-60" />
        <div className="hero-glow bottom-20 right-20 opacity-40" />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Career Platform</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-white">Bridge Your</span>
              <br />
              <span className="text-white">Skills to</span>
              <br />
              <span className="gradient-text">Limitless</span>
              <br />
              <span className="gradient-text">Opportunities</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              SkillBridge connects talented individuals with top employers based
              on skills, not just degrees. Build your future today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/auth/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Play className="w-3 h-3 text-blue-400 ml-0.5" />
                </div>
                Learn More
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {[
                { value: "10K+", label: "Active Jobs", icon: TrendingUp, color: "text-blue-400" },
                { value: "25K+", label: "Job Seekers", icon: Users, color: "text-cyan-400" },
                { value: "5K+", label: "Companies", icon: Building2, color: "text-purple-400" },
                { value: "98%", label: "Success Rate", icon: Sparkles, color: "text-green-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - 3D Illustration / Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind character */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl" />

              {/* Main illustration - professional character with laptop */}
              <div className="relative z-10 flex items-center justify-center">
                <div
                  className="w-96 h-96 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 50% 80%, rgba(59,130,246,0.2) 0%, transparent 70%)",
                  }}
                />

                {/* Floating skill badges */}
                {[
                  { skill: "React", delay: 0, x: -160, y: -80, color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" },
                  { skill: "Node.js", delay: 0.5, x: 160, y: -100, color: "bg-green-500/20 border-green-500/30 text-green-400" },
                  { skill: "TypeScript", delay: 1, x: -180, y: 40, color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
                  { skill: "Python", delay: 1.5, x: 170, y: 60, color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" },
                  { skill: "AWS", delay: 2, x: -60, y: 140, color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
                  { skill: "Docker", delay: 2.5, x: 80, y: 130, color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
                ].map((badge) => (
                  <motion.div
                    key={badge.skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + badge.delay * 0.2 }}
                    style={{ position: "absolute", transform: `translate(${badge.x}px, ${badge.y}px)` }}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.color}`}
                  >
                    {badge.skill}
                  </motion.div>
                ))}

                {/* Central illustration */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-72 h-72 relative">
                    {/* Person silhouette / professional illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-64 h-64 rounded-full"
                        style={{
                          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
                          boxShadow: "0 0 60px rgba(59, 130, 246, 0.4)",
                        }}
                      />
                    </div>
                    {/* Laptop icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-48 h-48 text-blue-200">
                        <circle cx="100" cy="70" r="25" fill="#bfdbfe" />
                        <rect x="60" y="100" width="80" height="60" rx="8" fill="#93c5fd" />
                        <rect x="55" y="160" width="90" height="8" rx="4" fill="#60a5fa" />
                        <rect x="50" y="168" width="100" height="4" rx="2" fill="#3b82f6" />
                        <rect x="65" y="108" width="70" height="44" rx="4" fill="#1d4ed8" />
                        <rect x="70" y="112" width="60" height="36" rx="2" fill="#172554" />
                        {/* Screen content */}
                        <rect x="74" y="116" width="30" height="3" rx="1.5" fill="#60a5fa" />
                        <rect x="74" y="122" width="20" height="2" rx="1" fill="#475569" />
                        <rect x="74" y="127" width="25" height="2" rx="1" fill="#475569" />
                        <rect x="74" y="132" width="15" height="2" rx="1" fill="#475569" />
                        <rect x="108" y="116" width="18" height="28" rx="3" fill="#1e40af" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Job match card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute bottom-10 right-0 glass-card p-4 min-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">95% Match</div>
                    <div className="text-slate-500 text-xs">Full Stack Dev</div>
                  </div>
                </div>
                <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                </div>
              </motion.div>

              {/* New job alert card */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute top-10 left-0 glass-card p-3 min-w-[170px]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">New Match!</span>
                </div>
                <div className="text-white text-sm font-semibold mt-1">Frontend Developer</div>
                <div className="text-slate-400 text-xs">Tech Solutions • Remote</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#0d1117"
          />
        </svg>
      </div>
    </section>
  );
}
