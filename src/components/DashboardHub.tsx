import { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  Plus, 
  MapPin, 
  Truck, 
  User, 
  Megaphone, 
  FileText, 
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { BusinessLink, Route, Partner, Campaign, LogMessage } from "../types";

interface DashboardHubProps {
  links: BusinessLink[];
  routes: Route[];
  partners: Partner[];
  campaigns: Campaign[];
  logs: LogMessage[];
  onNavigate: (menu: string) => void;
  onQuickAction: (action: string) => void;
}

export default function DashboardHub({
  links,
  routes,
  partners,
  campaigns,
  logs,
  onNavigate,
  onQuickAction
}: DashboardHubProps) {
  // Compute dashboard metrics
  const activeRoutesCount = routes.filter(r => r.status === "active").length;
  const totalPartnersCount = partners.length;
  const totalCampaignsCount = campaigns.length;
  const totalLinksCount = links.length;

  // Let's create mock traffic/clicks analytics
  const totalClicks = links.length * 432 + 5800;
  const avgCTR = "4.2%";

  // Quick Action handler
  return (
    <div className="space-y-6" id="dashboard-hub">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Active Routes */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all min-h-[140px]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Active Routes</span>
              <span className="text-3xl font-black text-white font-display mt-2 block">{activeRoutesCount} / {routes.length}</span>
            </div>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Truck size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-3">
            <TrendingUp size={12} />
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* KPI: Business Links */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all min-h-[140px]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Monitored Links</span>
              <span className="text-3xl font-black text-white font-display mt-2 block">{totalLinksCount}</span>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Plus size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-3">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>Fully mapped across sitemap</span>
          </div>
        </div>

        {/* KPI: Active Partners */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all min-h-[140px]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Partners & Vendors</span>
              <span className="text-3xl font-black text-white font-display mt-2 block">{totalPartnersCount}</span>
            </div>
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <User size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-3">
            <TrendingUp size={12} />
            <span>3 pending SLA reviews</span>
          </div>
        </div>

        {/* KPI: Link Telemetry Clicks */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all min-h-[140px]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Telemetry CTR</span>
              <span className="text-3xl font-black text-white font-display mt-2 block">{avgCTR}</span>
            </div>
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
              <Activity size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-mono mt-3 font-semibold">
            <span>{totalClicks.toLocaleString()} Total Link Clicks</span>
          </div>
        </div>
      </div>

      {/* Two-Column Details Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions & Live Map summary (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions Panel */}
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Rapid Control Center Actions</h3>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono rounded font-bold">OPERATIONS</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button 
                onClick={() => onQuickAction("add-link")}
                className="p-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-emerald-500/20 rounded-2xl text-left transition-all group flex items-start gap-3 outline-none"
              >
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Plus size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Add Business Link</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Register operations portal, HR documents or compliance URLs.</p>
                </div>
              </button>

              <button 
                onClick={() => onQuickAction("add-route")}
                className="p-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-indigo-500/20 rounded-2xl text-left transition-all group flex items-start gap-3 outline-none"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Add Transit Route</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Configure dispatch stops, assign driver timetables, and map fleet.</p>
                </div>
              </button>

              <button 
                onClick={() => onQuickAction("invite-partner")}
                className="p-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-purple-500/20 rounded-2xl text-left transition-all group flex items-start gap-3 outline-none"
              >
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Invite Vendor / Partner</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Onboard external ticketing services, fuel grids or insurers.</p>
                </div>
              </button>

              <button 
                onClick={() => onQuickAction("create-campaign")}
                className="p-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-teal-500/20 rounded-2xl text-left transition-all group flex items-start gap-3 outline-none"
              >
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Megaphone size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">Launch Promo Campaign</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Promote underperforming routes with promo codes and targets.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Stats Summary Graphic */}
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">System Link Mapping Distribution</h3>
              <span className="text-[9px] text-slate-500 font-mono">Active Mappings</span>
            </div>
            
            <div className="space-y-3">
              {[
                { name: "Operations & Fleet", count: links.filter(l => l.category === 'operations').length, color: "bg-emerald-500" },
                { name: "Finance & Payroll", count: links.filter(l => l.category === 'finance').length, color: "bg-blue-500" },
                { name: "HR & Mandatory Training", count: links.filter(l => l.category === 'hr_training').length, color: "bg-purple-500" },
                { name: "Legal & Regulatory Compliance", count: links.filter(l => l.category === 'legal_compliance').length, color: "bg-amber-500" },
                { name: "External Vendors & Services", count: links.filter(l => l.category === 'external').length, color: "bg-rose-500" },
              ].map((item, idx) => {
                const total = links.length || 1;
                const percent = Math.round((item.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{item.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{item.count} items ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Logs / Activity Feed (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="text-indigo-400 animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-display">System Operations Telemetry</h3>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">REAL-TIME</span>
          </div>

          {/* Activity Feed Scroller */}
          <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-900 font-mono text-[10px] space-y-3.5 max-h-[380px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">No telemetry broadcast logs active.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-2 items-start hover:bg-slate-900/40 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-900">
                  <span className="text-slate-550 shrink-0 select-none">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <span className={`font-semibold ${
                      log.type === "success" ? "text-emerald-400" :
                      log.type === "warning" ? "text-amber-400" :
                      log.type === "error" ? "text-rose-400" :
                      "text-slate-300"
                    }`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-500 leading-normal flex gap-2 items-start bg-slate-950/20 p-3 rounded-xl border border-slate-900/40">
            <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
            <p>MUBUSLINK neutral gateway synchronizer operates continuously. All external portals verified responsive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
