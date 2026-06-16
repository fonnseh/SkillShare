"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";

const data = [
  { month: "Jan", applications: 4, interviews: 1, offers: 0 },
  { month: "Feb", applications: 7, interviews: 2, offers: 0 },
  { month: "Mar", applications: 5, interviews: 2, offers: 1 },
  { month: "Apr", applications: 12, interviews: 4, offers: 1 },
  { month: "May", applications: 9, interviews: 3, offers: 2 },
  { month: "Jun", applications: 15, interviews: 5, offers: 2 },
  { month: "Jul", applications: 8, interviews: 3, offers: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function ApplicationsChart() {
  return (
    <div className="card-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold">Application Activity</h3>
          <p className="text-slate-400 text-xs mt-0.5">Last 7 months overview</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-blue-500 inline-block" />Applied</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-green-500 inline-block" />Interviews</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-purple-500 inline-block" />Offers</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="applications" name="Applied" stroke="#3b82f6" fill="url(#colorApps)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#22c55e" fill="url(#colorInt)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="offers" name="Offers" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Admin Analytics Charts
const platformData = [
  { month: "Jan", users: 3200, jobs: 820, applications: 280 },
  { month: "Feb", users: 3800, jobs: 940, applications: 350 },
  { month: "Mar", users: 4200, jobs: 1050, applications: 420 },
  { month: "Apr", users: 5100, jobs: 1200, applications: 510 },
  { month: "May", users: 5800, jobs: 1350, applications: 590 },
  { month: "Jun", users: 6500, jobs: 1480, applications: 680 },
  { month: "Jul", users: 7200, jobs: 1600, applications: 750 },
];

export function PlatformAnalyticsChart() {
  return (
    <div className="card-dark p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold">Platform Analytics</h3>
          <p className="text-slate-400 text-xs mt-0.5">Users, Jobs & Applications over time</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-blue-500 inline-block" />Users</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-green-500 inline-block" />Jobs</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-purple-500 inline-block" />Applications</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={platformData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            {[["blue", "#3b82f6"], ["green", "#22c55e"], ["purple", "#a855f7"]].map(([name, color]) => (
              <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" fill="url(#grad-blue)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="jobs" name="Jobs" stroke="#22c55e" fill="url(#grad-green)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="applications" name="Applications" stroke="#a855f7" fill="url(#grad-purple)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const categoryData = [
  { name: "IT & Software", value: 45 },
  { name: "Design", value: 20 },
  { name: "Marketing", value: 18 },
  { name: "Finance", value: 10 },
  { name: "Others", value: 7 },
];

export function TopJobCategoriesChart() {
  return (
    <div className="card-dark p-6">
      <h3 className="text-white font-semibold mb-5">Top Job Categories</h3>
      <div className="space-y-3">
        {categoryData.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">{cat.name}</span>
              <span className="text-blue-400 font-medium">{cat.value}%</span>
            </div>
            <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${cat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationsBarChart({ data: chartData }: { data?: any[] }) {
  const d = chartData || [
    { month: "Jan", value: 220 }, { month: "Feb", value: 310 }, { month: "Mar", value: 280 },
    { month: "Apr", value: 430 }, { month: "May", value: 380 }, { month: "Jun", value: 510 }, { month: "Jul", value: 460 },
  ];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={d} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
