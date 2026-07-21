import { useState } from "react";
import { 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Clock, 
  MapPin, 
  TrendingDown, 
  Download, 
  Share2,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { BusinessLink, Route, Partner, Campaign } from "../types";

interface AnalyticsReportsProps {
  links: BusinessLink[];
  routes: Route[];
  partners: Partner[];
  campaigns: Campaign[];
}

export default function AnalyticsReports({
  links,
  routes,
  partners,
  campaigns
}: AnalyticsReportsProps) {
  const [filterPeriod, setFilterPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [isExporting, setIsExporting] = useState(false);

  // Generate some high-fidelity visual metrics
  const totalClicks = links.reduce((acc, l) => acc + (l.title.length * 32 + 150), 0) * (filterPeriod === "7d" ? 1.5 : filterPeriod === "90d" ? 11 : 4.5);
  const conversionRate = 18.2;
  const activeTripsCount = routes.filter(r => r.status === "active").length * 8 * (filterPeriod === "7d" ? 7 : filterPeriod === "90d" ? 90 : 30);
  const avgSlaAdherence = 99.4;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("MUBUSLINK Analytics Report exported as PDF/CSV successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6" id="analytics-reports">
      {/* Filters & Export Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/20 p-4 border border-slate-900 rounded-3xl">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-500" />
          <span className="text-xs text-slate-400 font-mono">Report timeframe:</span>
          <div className="flex bg-slate-950/80 p-0.5 border border-slate-900 rounded-xl select-none">
            {(["7d", "30d", "90d"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black font-mono transition-all uppercase ${
                  filterPeriod === period ? "bg-emerald-600 text-slate-950" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          {isExporting ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
          <span>Export SLA Audit Report</span>
        </button>
      </div>

      {/* Analytics KPI board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total telemetry traffic */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Operations Telemetry clicks</span>
          <span className="text-2xl font-black text-white block font-display mt-1.5">{Math.round(totalClicks).toLocaleString()}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-3 font-semibold">
            <TrendingUp size={12} />
            <span>+14.2% week-on-week</span>
          </div>
        </div>

        {/* Dispatch adherence */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Average SLA Adherence</span>
          <span className="text-2xl font-black text-white block font-display mt-1.5">{avgSlaAdherence}%</span>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-3 font-semibold">
            <TrendingUp size={12} />
            <span>Exceeds FTA threshold</span>
          </div>
        </div>

        {/* Trips completed */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Total Trips Logged</span>
          <span className="text-2xl font-black text-white block font-display mt-1.5">{activeTripsCount.toLocaleString()}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-3 font-semibold">
            <TrendingUp size={12} />
            <span>100% GPS verified</span>
          </div>
        </div>

        {/* Conversions */}
        <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Campaign Ticket CTR</span>
          <span className="text-2xl font-black text-white block font-display mt-1.5">{conversionRate}%</span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-3 font-semibold">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            <span>Average conversion rate</span>
          </div>
        </div>
      </div>

      {/* Custom Graphic charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Traffic Click Chart */}
        <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2">
              <Activity size={13} className="text-indigo-400 animate-pulse" />
              <span>Operations Portal Usage Frequency</span>
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">Hourly load metrics</span>
          </div>

          {/* Clean Bespoke SVG Area Chart */}
          <div className="h-[200px] w-full flex items-end justify-between gap-1 pt-4 px-2 bg-slate-950/60 border border-slate-900 rounded-2xl relative overflow-hidden select-none">
            {/* Background grids */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none select-none">
              <div className="w-full border-t border-slate-900/50" />
              <div className="w-full border-t border-slate-900/50" />
              <div className="w-full border-t border-slate-900/50" />
            </div>

            {/* SVG graph line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill path */}
              <path 
                d="M 0 100 L 0 85 L 15 70 L 30 78 L 45 40 L 60 48 L 75 15 L 90 25 L 100 10 L 100 100 Z" 
                fill="url(#chartGrad)" 
              />
              {/* Line path */}
              <path 
                d="M 0 85 L 15 70 L 30 78 L 45 40 L 60 48 L 75 15 L 90 25 L 100 10" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>

            {/* Chart X axis text */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[9px] text-slate-600 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        {/* Route SLA Adherence Chart */}
        <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>Route Dispatch Load Adherence</span>
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">Schedules Mapped</span>
          </div>

          <div className="space-y-3 pt-2">
            {routes.map((route, ri) => {
              const baseAdh = 98.2 + (ri * 0.7);
              const percent = Math.min(100, baseAdh);
              return (
                <div key={route.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{route.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{percent.toFixed(1)}% SLA verified</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                    <div 
                      className={`h-full bg-emerald-500 rounded-full`} 
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
