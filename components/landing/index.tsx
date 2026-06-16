"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Brain,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

// ── Stats Section ─────────────────────────────────────────────────────────────

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function StatsSection() {
  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Active Jobs",
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      value: 25000,
      suffix: "+",
      label: "Job Seekers",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      value: 5000,
      suffix: "+",
      label: "Companies",
      icon: Building2,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      value: 98,
      suffix: "%",
      label: "Success Rate",
      icon: Sparkles,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <section className="py-16 bg-[#0d1117] border-y border-[#21262d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className={`text-4xl font-bold ${stat.color}`}>
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Popular Jobs ──────────────────────────────────────────────────────────────

const popularJobs = [
  {
    title: "Full Stack Developer",
    company: "Tech Solutions Ltd",
    location: "Buea, Cameroon",
    salary: "₦800K - ₦1.2M",
    type: "Full-time",
    match: 95,
    logo: "TS",
    color: "bg-blue-600",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Backend Developer",
    company: "CodeCraft Inc.",
    location: "Remote",
    salary: "$5K - $8K/mo",
    type: "Remote",
    match: 88,
    logo: "CC",
    color: "bg-purple-600",
    tags: ["Python", "Django", "PostgreSQL"],
  },
  {
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Abuja, Nigeria",
    salary: "₦600K - ₦900K",
    type: "Full-time",
    match: 82,
    logo: "DS",
    color: "bg-pink-600",
    tags: ["Figma", "Adobe XD", "CSS"],
  },
  {
    title: "DevOps Engineer",
    company: "CloudNet Inc.",
    location: "Remote",
    salary: "$6K - $10K/mo",
    type: "Remote",
    match: 79,
    logo: "CN",
    color: "bg-green-600",
    tags: ["Docker", "Kubernetes", "AWS"],
  },
  {
    title: "Mobile App Developer",
    company: "AppForge",
    location: "Buea, Cameroon",
    salary: "₦700K - ₦1M",
    type: "Full-time",
    match: 85,
    logo: "AF",
    color: "bg-orange-600",
    tags: ["React Native", "Flutter", "JavaScript"],
  },
  {
    title: "Data Scientist",
    company: "DataMind AI",
    location: "Remote",
    salary: "$4K - $7K/mo",
    type: "Contract",
    match: 74,
    logo: "DM",
    color: "bg-cyan-600",
    tags: ["Python", "TensorFlow", "ML"],
  },
];

export function PopularJobsSection() {
  return (
    <section className="py-24 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Popular <span className="gradient-text">Jobs</span>
            </h2>
            <p className="text-slate-400">
              Find opportunities that match your skills
            </p>
          </div>
          <Link
            href="/jobs"
            className="btn-secondary hidden sm:flex items-center gap-2"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularJobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card-dark p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${job.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-slate-400 text-xs">{job.company}</p>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.match >= 90 ? "bg-green-500/20 text-green-400" : job.match >= 80 ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}
                >
                  {job.match}% Match
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.tags.map((tag) => (
                  <span key={tag} className="badge-blue text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.type}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-semibold text-sm flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary}
                </span>
                <button className="text-xs bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all duration-200">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Internships Section ───────────────────────────────────────────────────────

const internships = [
  {
    title: "Software Engineering Intern",
    company: "Tech Solutions Ltd",
    duration: "3 months",
    stipend: "₦150K/month",
    deadline: "Dec 30, 2024",
    tags: ["React", "Node.js"],
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignStudio",
    duration: "6 months",
    stipend: "₦100K/month",
    deadline: "Jan 15, 2025",
    tags: ["Figma", "Design"],
  },
  {
    title: "Data Science Intern",
    company: "DataMind AI",
    duration: "4 months",
    stipend: "$1,500/month",
    deadline: "Jan 20, 2025",
    tags: ["Python", "ML"],
  },
];

export function InternshipsSection() {
  return (
    <section className="py-24 bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Internship Programs</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your <span className="gradient-text">Career Journey</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Gain real-world experience with top companies through our curated
            internship programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {internships.map((intern, i) => (
            <motion.div
              key={intern.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-dark p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 text-xs font-medium">
                  Internship
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{intern.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{intern.company}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {intern.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                <div className="flex justify-between">
                  <span>Duration:</span>{" "}
                  <span className="text-white">{intern.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stipend:</span>{" "}
                  <span className="text-green-400">{intern.stipend}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline:</span>{" "}
                  <span className="text-yellow-400">{intern.deadline}</span>
                </div>
              </div>
              <button className="w-full py-2 text-sm bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 hover:border-purple-600 rounded-lg transition-all duration-200">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Match Section ──────────────────────────────────────────────────────────

export function AIMatchSection() {
  return (
    <section className="py-24 bg-[#0d1117] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Matching</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Smart Matching That
              <span className="gradient-text"> Actually Works</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Our AI engine analyzes 50+ data points including your skills,
              experience, projects, and career goals to find opportunities where
              you'll truly excel.
            </p>
            <ul className="space-y-4">
              {[
                {
                  label: "Resume Analysis & ATS Score",
                  desc: "Instant feedback on your resume quality",
                },
                {
                  label: "Skill Gap Detection",
                  desc: "Know exactly what skills to develop",
                },
                {
                  label: "Personalized Job Recommendations",
                  desc: "Jobs matched to your unique profile",
                },
                {
                  label: "Career Path Suggestions",
                  desc: "AI-guided career planning",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {item.label}
                    </div>
                    <div className="text-slate-500 text-xs">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="btn-primary inline-flex items-center gap-2 mt-8"
            >
              Try AI Matching <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* AI match visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="card-dark p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    AI Job Recommendations
                  </div>
                  <div className="text-slate-400 text-xs">
                    Based on your profile
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Senior Full Stack Developer",
                    company: "Tech Solutions",
                    match: 96,
                    color: "bg-green-500",
                  },
                  {
                    title: "Software Engineer",
                    company: "DevSolutions",
                    match: 90,
                    color: "bg-blue-500",
                  },
                  {
                    title: "Frontend Developer",
                    company: "CodeCraft",
                    match: 85,
                    color: "bg-blue-400",
                  },
                  {
                    title: "Product Designer",
                    match: 70,
                    company: "CreateLabs",
                    color: "bg-yellow-500",
                  },
                ].map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center gap-4 p-3 bg-[#21262d] rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {job.title}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {job.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-24 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${job.match}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full ${job.color} rounded-full`}
                        />
                      </div>
                      <span className="text-xs font-bold text-white w-10 text-right">
                        {job.match}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Skill Gap Detected</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Adding <strong className="text-white">GraphQL</strong> and{" "}
                  <strong className="text-white">Redis</strong> could increase
                  your match rate by 15%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Frontend Developer at Flutterwave",
    text: "SkillBridge helped me land my dream job in just 3 weeks! The AI matching was spot-on — every recommendation felt personally curated.",
    rating: 5,
    avatar: "AO",
    color: "bg-pink-600",
  },
  {
    name: "Emeka Nwachukwu",
    role: "Senior Engineer at Paystack",
    text: "The skill portfolio feature let me showcase projects that my resume couldn't capture. I got 4 interviews in one week!",
    rating: 5,
    avatar: "EN",
    color: "bg-blue-600",
  },
  {
    name: "Chioma Eze",
    role: "HR Manager at TechStartup",
    text: "As an employer, SkillBridge gives us pre-qualified candidates with clear skill profiles. Reduced our hiring time by 60%.",
    rating: 5,
    avatar: "CE",
    color: "bg-green-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-slate-400">
            Hear from people who found their perfect match
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-dark p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Is SkillBridge free for job seekers?",
    a: "Yes! Creating a profile, searching jobs, and applying is completely free for job seekers. Premium features like AI career coaching are available with our Pro plan.",
  },
  {
    q: "How does AI job matching work?",
    a: "Our AI analyzes your skills, experience, projects, and preferences against job requirements to calculate a compatibility score. The higher the score, the better the fit.",
  },
  {
    q: "How do I verify my skills?",
    a: "You can verify skills through our built-in assessments, by adding certifications from recognized platforms (AWS, Google, Coursera), or by completing projects in your portfolio.",
  },
  {
    q: "Can employers see my profile without me applying?",
    a: "Yes, employers can find you through search if your profile is set to public. You can control visibility in your privacy settings.",
  },
  {
    q: "What industries are covered on SkillBridge?",
    a: "We cover Technology, Finance, Healthcare, Marketing, Design, Data Science, and more — with over 50 job categories.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#0d1117]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-dark overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{faq.q}</span>
                {open === i ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5"
                >
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
