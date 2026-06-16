"use client";

import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <div className="h-16 border-b border-[#21262d] flex items-center justify-between px-6 bg-[#0d1117] sticky top-0 z-40 flex-shrink-0">
      <div>
        <h1 className="text-white font-semibold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#161b22] border border-[#21262d] text-slate-300 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-48"
          />
        </div>
        <Link href="/notifications" className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#161b22] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </Link>
        <Link href="/profile">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-xs">
              {session?.user?.name?.charAt(0) || "U"}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
