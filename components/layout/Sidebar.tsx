"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, User, Briefcase, BookmarkCheck, Send,
  Star, MessageSquare, Bell, Settings, LogOut, Zap, Users,
  Building2, BarChart3, PlusCircle, FileText, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const jobSeekerNav = [
  { label: "Dashboard", href: "/dashboard/job-seeker", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "My Applications", href: "/applications", icon: Send },
  { label: "Recommended Jobs", href: "/recommendations", icon: Star },
  { label: "Saved Jobs", href: "/saved-jobs", icon: BookmarkCheck },
  { label: "Internships", href: "/internships", icon: Briefcase },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

const employerNav = [
  { label: "Dashboard", href: "/dashboard/employer", icon: LayoutDashboard },
  { label: "My Jobs", href: "/my-jobs", icon: Briefcase },
  { label: "Post New Job", href: "/post-job", icon: PlusCircle },
  { label: "Applicants", href: "/applicants", icon: Users },
  { label: "Interviews", href: "/interviews", icon: Star },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Company Profile", href: "/company-profile", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "For Seekers", href: "/admin/job-seekers", icon: User },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Users", href: "/manage-users", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  role?: "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
}

export function Sidebar({ role = "JOB_SEEKER" }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const navItems =
    role === "EMPLOYER" ? employerNav : role === "ADMIN" ? adminNav : jobSeekerNav;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex-shrink-0 h-screen sticky top-0 overflow-hidden"
      style={{ background: "#0f172a", borderRight: "1px solid #1e293b" }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={clsx("flex items-center h-16 px-4 border-b border-[#1e293b] flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">SkillBridge</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={clsx(
              "text-slate-500 hover:text-white transition-colors p-1 rounded",
              collapsed && "absolute right-2 top-4"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-[#1e293b] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-sm">
                  {session?.user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{session?.user?.name || "User"}</div>
                <div className="text-slate-500 text-xs truncate">
                  {role === "ADMIN" ? "Admin" : role === "EMPLOYER" ? "Employer" : "Job Seeker"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2.5",
                  isActive
                    ? "bg-blue-600/20 text-white border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-[#1e293b]"
                )}
              >
                <item.icon className={clsx("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4", isActive ? "text-blue-400" : "")} />
                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#1e293b] flex-shrink-0 space-y-1">
          <Link
            href="/notifications"
            className={clsx(
              "flex items-center rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:bg-[#1e293b]",
              collapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2.5"
            )}
          >
            <Bell className={clsx("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
            {!collapsed && <span className="text-sm font-medium">Notifications</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={clsx(
              "w-full flex items-center rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/10",
              collapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2.5"
            )}
          >
            <LogOut className={clsx("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
