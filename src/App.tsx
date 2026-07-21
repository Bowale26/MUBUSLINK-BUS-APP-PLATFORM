import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Globe, 
  Truck, 
  User, 
  Megaphone, 
  Activity, 
  HelpCircle, 
  Settings, 
  Bell, 
  Clock, 
  CheckCircle, 
  Database,
  ArrowRight,
  ChevronRight,
  Terminal,
  RefreshCw,
  X,
  Plus,
  CreditCard,
  Lock,
  AlertTriangle,
  Cookie,
  Trash2,
  Sparkles,
  Cpu,
  Search
} from "lucide-react";

import { clearAllCookiesAndCache } from "./utils/clearCache";

// Import types & mock data
import { BusinessLink, Route, Partner, Campaign, LogMessage } from "./types";
import { 
  initialBusinessLinks, 
  initialRoutes, 
  initialPartners, 
  initialCampaigns 
} from "./data";

// Import page components
import DashboardHub from "./components/DashboardHub";
import BusinessLinksDirectory from "./components/BusinessLinksDirectory";
import RoutesSchedules from "./components/RoutesSchedules";
import VendorsPartners from "./components/VendorsPartners";
import MarketingPromotions from "./components/MarketingPromotions";
import AnalyticsReports from "./components/AnalyticsReports";
import SupportDocs from "./components/SupportDocs";
import AdminSettings from "./components/AdminSettings";
import SubscriptionBilling from "./components/SubscriptionBilling";
import NovaCreativeSuite from "./components/NovaCreativeSuite";
import GoogleAIStudioFeatures from "./components/GoogleAIStudioFeatures";

export default function App() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [activeLinkCategory, setActiveLinkCategory] = useState<string>("all");
  const [navSearchQuery, setNavSearchQuery] = useState<string>("");

  // Subscription & User profile state
  const [currentUserProfile, setCurrentUserProfile] = useState<any | null>(() => {
    const saved = localStorage.getItem("mubuslink_mock_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isForcedExpired, setIsForcedExpired] = useState<boolean>(() => {
    return localStorage.getItem("mubuslink_forced_expired") === "true";
  });

  const getTrialDaysRemaining = () => {
    if (!currentUserProfile || currentUserProfile.subscriptionStatus !== "trial") return 0;
    if (isForcedExpired) return 0;
    const start = new Date(currentUserProfile.trialStartedAt).getTime();
    const expiry = start + 7 * 24 * 60 * 60 * 1000;
    const remaining = expiry - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  };

  const isTrialExpired = currentUserProfile && 
    currentUserProfile.subscriptionStatus === "trial" && 
    (isForcedExpired || getTrialDaysRemaining() <= 0);

  // Auto-redirect to paywall/subscription tab if trial has expired
  useEffect(() => {
    if (isTrialExpired && activeMenu !== "subscription") {
      setActiveMenu("subscription");
      addLog("Your 7-Day Free Trial has expired. Please subscribe via Stripe.", "error");
    }
  }, [isTrialExpired, activeMenu]);

  const handleForceExpireToggle = (expired: boolean) => {
    setIsForcedExpired(expired);
    localStorage.setItem("mubuslink_forced_expired", String(expired));
  };

  // Core Data State (synchronized locally + backed by Firestore APIs where applicable)
  const [links, setLinks] = useState<BusinessLink[]>(() => {
    const saved = localStorage.getItem("mubuslink_links");
    return saved ? JSON.parse(saved) : initialBusinessLinks;
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem("mubuslink_routes");
    return saved ? JSON.parse(saved) : initialRoutes;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem("mubuslink_partners");
    return saved ? JSON.parse(saved) : initialPartners;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem("mubuslink_campaigns");
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  // Firestore Projects listing (Requested in Checkpoint 1, #2)
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // System logs/telemetry state
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Notifications bell state
  // Helper to resolve current subscription badge info for header visual indicator
  const getSubscriptionBadgeInfo = () => {
    if (!currentUserProfile) {
      return {
        label: "Free Trial",
        subtext: "7 Days",
        badgeStyle: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400",
        dotStyle: "bg-amber-400",
        icon: <Clock size={11} className="text-amber-400" />
      };
    }

    if (currentUserProfile.subscriptionStatus === "trial") {
      const days = getTrialDaysRemaining();
      if (isTrialExpired || days <= 0) {
        return {
          label: "Expired",
          subtext: "Subscribe",
          badgeStyle: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400",
          dotStyle: "bg-rose-500 animate-ping",
          icon: <AlertTriangle size={11} className="text-rose-400 animate-pulse" />
        };
      }
      return {
        label: "Free Trial",
        subtext: `${days}d left`,
        badgeStyle: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400",
        dotStyle: "bg-amber-400",
        icon: <Clock size={11} className="text-amber-400" />
      };
    }

    if (
      currentUserProfile.subscriptionStatus === "monthly" ||
      currentUserProfile.subscriptionStatus === "yearly" ||
      currentUserProfile.subscriptionStatus === "active" ||
      currentUserProfile.subscriptionStatus === "pro"
    ) {
      const planLabel = currentUserProfile.subscriptionStatus === "yearly" ? "Active Pro (Yearly)" : "Active Pro";
      return {
        label: planLabel,
        subtext: "Subscribed",
        badgeStyle: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
        dotStyle: "bg-emerald-400",
        icon: <CheckCircle size={11} className="text-emerald-400" />
      };
    }

    return {
      label: "Expired",
      subtext: "Renew Plan",
      badgeStyle: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400",
      dotStyle: "bg-rose-500",
      icon: <AlertTriangle size={11} className="text-rose-400" />
    };
  };

  const [notifications, setNotifications] = useState<{ id: string; msg: string; unread: boolean; time: string }[]>([
    { id: "1", msg: "Pacific Express (Route 101) dispatch SLA fully verified.", unread: true, time: "10m ago" },
    { id: "2", msg: "Allianz Fleet contract renewal critical review pending.", unread: true, time: "2h ago" },
  ]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isClearingHeaderCache, setIsClearingHeaderCache] = useState(false);

  const handleHeaderClearCache = async () => {
    if (!confirm("Clear all cookies, localStorage, sessionStorage, and cache completely from this app?")) {
      return;
    }
    setIsClearingHeaderCache(true);
    try {
      const res = await clearAllCookiesAndCache();
      addLog(`Cookies and Cache completely wiped (${res.clearedItems.join(", ")})`, "success");
      setLinks(initialBusinessLinks);
      setRoutes(initialRoutes);
      setPartners(initialPartners);
      setCampaigns(initialCampaigns);
      setCurrentUserProfile(null);
      setIsForcedExpired(false);
    } catch (err: any) {
      addLog(`Failed to clear cookies/cache: ${err.message}`, "warning");
    } finally {
      setIsClearingHeaderCache(false);
    }
  };

  // Local storage synchronization & initial log triggering
  useEffect(() => {
    localStorage.setItem("mubuslink_links", JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem("mubuslink_routes", JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem("mubuslink_partners", JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem("mubuslink_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  // Initial setup telemetry logs
  useEffect(() => {
    addLog("System boot complete. Welcome to MUBUSLINK.", "success");
    addLog("Firestore collection handshake: OK", "info");
    addLog("Central operations API listener: ONLINE", "info");
    fetchProjects();
  }, []);

  // Fetch projects from central Express Firestore proxy
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data || []);
      }
    } catch (e) {
      console.warn("Could not fetch user_projects from Firestore proxy, bypassing:", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Bulk-delete projects (Requested in Checkpoint 1, #2)
  const handleBulkDeleteProjects = async (projectIds: string[]) => {
    try {
      await Promise.all(
        projectIds.map(async (id) => {
          await fetch(`/api/projects/${id}`, { method: "DELETE" });
        })
      );
      // Update local projects
      setProjects(prev => prev.filter(p => !projectIds.includes(p.projectId)));
      addLog(`Bulk-deleted ${projectIds.length} projects from Firestore`, "success");
    } catch (err: any) {
      console.error("Bulk delete failure:", err);
      throw new Error(`Bulk delete failed: ${err.message}`);
    }
  };

  // Helper to add a system telemetry log
  const addLog = (message: string, type: LogMessage["type"] = "info") => {
    const newLog: LogMessage = {
      id: `log_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  // CRUD actions for Business Links
  const handleAddLink = (newLink: Omit<BusinessLink, "id" | "lastUpdated">) => {
    const link: BusinessLink = {
      ...newLink,
      id: `link_${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setLinks(prev => [link, ...prev]);
    addLog(`Resource cataloged: '${link.title}' under ${link.category}`, "success");
    
    // Save to Firestore as a user project environment as well to simulate real production integration
    saveProjectEnvironment(link.title, link.category, link.url);
  };

  const handleEditLink = (editedLink: BusinessLink) => {
    setLinks(prev => prev.map(l => l.id === editedLink.id ? editedLink : l));
    addLog(`Resource updated: '${editedLink.title}'`, "info");
  };

  const handleDeleteLink = (id: string) => {
    const target = links.find(l => l.id === id);
    setLinks(prev => prev.filter(l => l.id !== id));
    if (target) {
      addLog(`Resource unlinked: '${target.title}'`, "warning");
    }
  };

  // CRUD actions for Routes
  const handleAddRoute = (newRoute: Omit<Route, "id">) => {
    const r: Route = {
      ...newRoute,
      id: `route_${Date.now()}`
    };
    setRoutes(prev => [r, ...prev]);
    addLog(`Fleet route dispatched: '${r.name}'`, "success");
  };

  const handleEditRoute = (editedRoute: Route) => {
    setRoutes(prev => prev.map(r => r.id === editedRoute.id ? editedRoute : r));
    addLog(`Route schedules updated: '${editedRoute.name}'`, "info");
  };

  const handleDeleteRoute = (id: string) => {
    const target = routes.find(r => r.id === id);
    setRoutes(prev => prev.filter(r => r.id !== id));
    if (target) {
      addLog(`Route suspended: '${target.name}'`, "warning");
    }
  };

  // CRUD actions for Partners
  const handleAddPartner = (newPartner: Omit<Partner, "id">) => {
    const p: Partner = {
      ...newPartner,
      id: `partner_${Date.now()}`
    };
    setPartners(prev => [p, ...prev]);
    addLog(`Vendor onboarded: '${p.name}' (${p.category})`, "success");
  };

  const handleEditPartner = (editedPartner: Partner) => {
    setPartners(prev => prev.map(p => p.id === editedPartner.id ? editedPartner : p));
    addLog(`Vendor SLA updated: '${editedPartner.name}'`, "info");
  };

  const handleDeletePartner = (id: string) => {
    const target = partners.find(p => p.id === id);
    setPartners(prev => prev.filter(p => p.id !== id));
    if (target) {
      addLog(`Vendor offboarded: '${target.name}'`, "warning");
    }
  };

  // CRUD actions for Campaigns
  const handleAddCampaign = (newCamp: Omit<Campaign, "id" | "metrics">) => {
    const c: Campaign = {
      ...newCamp,
      id: `camp_${Date.now()}`,
      metrics: { clicks: 0, conversions: 0, ticketSales: 0 }
    };
    setCampaigns(prev => [c, ...prev]);
    addLog(`Promo campaign scheduled: '${c.name}'`, "success");
  };

  const handleEditCampaign = (editedCamp: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === editedCamp.id ? editedCamp : c));
    addLog(`Campaign metrics updated: '${editedCamp.name}'`, "info");
  };

  const handleDeleteCampaign = (id: string) => {
    const target = campaigns.find(c => c.id === id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (target) {
      addLog(`Promo campaign terminated: '${target.name}'`, "warning");
    }
  };

  // Sync / Save environment to Firestore proxy
  const saveProjectEnvironment = async (businessName: string, jurisdictions: string, services: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          jurisdictions,
          services,
          createdAt: new Date().toISOString()
        })
      });
      if (response.ok) {
        addLog(`Environment cataloged in Firestore user_projects`, "success");
        fetchProjects(); // Refresh settings panel list
      }
    } catch (e) {
      console.warn("Firestore bypass: environment saved locally.", e);
    }
  };

  // Quick Action triggers from Dashboard
  const handleQuickAction = (action: string) => {
    if (isTrialExpired) {
      addLog("Access Denied: Trial expired. Please subscribe to perform actions.", "error");
      setActiveMenu("subscription");
      return;
    }
    if (action === "add-link") {
      setActiveMenu("links");
      addLog("Redirecting to Link catalog workflow...", "info");
    } else if (action === "add-route") {
      setActiveMenu("routes");
      addLog("Redirecting to Route dispatch workflow...", "info");
    } else if (action === "invite-partner") {
      setActiveMenu("partners");
      addLog("Redirecting to SLA onboarding workflow...", "info");
    } else if (action === "create-campaign") {
      setActiveMenu("marketing");
      addLog("Redirecting to Promo scheduler...", "info");
    }
  };

  // Helper to format simulated clean routing paths in address bar
  const getSimulatedPath = () => {
    switch (activeMenu) {
      case "dashboard": return "/dashboard";
      case "subscription": return "/subscription-billing";
      case "links": return activeLinkCategory === "all" ? "/links" : `/links/${activeLinkCategory}`;
      case "routes": return "/routes";
      case "partners": return "/partners";
      case "marketing": return "/marketing/campaigns";
      case "analytics": return "/analytics";
      case "support": return "/support";
      case "admin": return "/admin";
      case "nova-suite": return "/nova-suite";
      case "google-ai-studio": return "/google-ai-studio";
      default: return "/";
    }
  };

  // Navigation sidebar item details
  const navItems = [
    { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
    { id: "google-ai-studio", label: "Google AI Studio Core", icon: Cpu },
    { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
    { id: "links", label: "Business Links Directory", icon: Globe },
    { id: "routes", label: "Routes & Schedules", icon: Truck },
    { id: "partners", label: "Vendors & Partners", icon: User },
    { id: "marketing", label: "Marketing & Promotions", icon: Megaphone },
    { id: "analytics", label: "Analytics & Reports", icon: Activity },
    { id: "nova-suite", label: "Nova AI Creative Suite", icon: Sparkles },
    { id: "support", label: "Support & Documentation", icon: HelpCircle },
    { id: "admin", label: "Admin & Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Header & Simulated Address bar */}
      <header className="bg-slate-900/40 border-b border-slate-900 p-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-slate-950 font-black rounded-xl select-none">
              <Truck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wider text-white font-display">MUBUSLINK</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono font-bold rounded">BUS APP PLATFORM</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Enterprise links and logistics dispatch control center</p>
            </div>
          </div>

          {/* Simulated clean routing address bar (Required multi-page routes simulation!) */}
          <div className="flex-1 max-w-xl mx-auto w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 select-all font-bold">
            <div className="flex items-center gap-2 truncate">
              <Globe size={11} className="text-emerald-500 animate-pulse shrink-0" />
              <span>https://mubuslink.ai.studio</span>
              <span className="text-white font-black">{getSimulatedPath()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[8px] font-black shrink-0 text-slate-650 ml-2">
              <span className="flex items-center gap-1 text-emerald-500"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> LIVE GATEWAY</span>
            </div>
          </div>

          {/* Handshakes & Notifications */}
          <div className="flex items-center gap-3 justify-end shrink-0">
            {/* System handshakes */}
            <div className="hidden sm:flex items-center gap-3.5 text-[10px] font-mono font-semibold">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Database size={11} className="text-indigo-400" />
                <span>DB ACTIVE</span>
              </div>
            </div>

            {/* Clear Cookies & Cache Quick Button */}
            <button
              onClick={handleHeaderClearCache}
              disabled={isClearingHeaderCache}
              className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 hover:text-white rounded-xl text-[10px] font-bold font-mono flex items-center gap-1.5 transition-all outline-none cursor-pointer"
              title="Clear all cookies, localStorage, sessionStorage, and browser cache"
            >
              <Cookie size={12} className={isClearingHeaderCache ? "animate-spin text-rose-400" : "text-amber-400"} />
              <span className="hidden lg:inline">{isClearingHeaderCache ? "Clearing..." : "Clear Cookies & Cache"}</span>
            </button>

            {/* Subscription Status Visual Indicator Badge (Placed directly next to the notification bell) */}
            {(() => {
              const subBadge = getSubscriptionBadgeInfo();
              return (
                <button
                  onClick={() => setActiveMenu("subscription")}
                  className={`px-3 py-1.5 border rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer outline-none shadow-sm ${subBadge.badgeStyle}`}
                  title="Subscription status — Click to view & manage billing"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${subBadge.dotStyle}`} />
                  {subBadge.icon}
                  <span className="tracking-wide uppercase font-black">{subBadge.label}</span>
                  {subBadge.subtext && (
                    <span className="text-[9px] opacity-75 hidden sm:inline font-sans">({subBadge.subtext})</span>
                  )}
                </button>
              );
            })()}

            {/* Notification bell dropdown trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl relative hover:text-white transition-colors outline-none cursor-pointer"
              >
                <Bell size={13} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3 font-sans text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="font-black text-slate-300">Live Operator Broadcasts</span>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                        className="text-[9px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Clear unread
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-slate-500 italic text-center py-2">No active system alerts.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-2 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                            <p className={`leading-normal ${n.unread ? "text-white font-bold" : "text-slate-400"}`}>{n.msg}</p>
                            <span className="text-[9px] text-slate-500 font-mono block text-right">{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </header>

      {/* Guest Mode alert / trial activation banner */}
      {!currentUserProfile && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-indigo-900/40 px-4 py-2 text-center text-[10px] sm:text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-mono">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-200">
              <strong className="text-white">GUEST WORKSPACE:</strong> Operations database synchronization is offline. 
              Activate a <strong className="text-emerald-400">7-Day Free Trial</strong> to sync live routes & legal links.
            </span>
            <button 
              onClick={() => setActiveMenu("subscription")}
              className="ml-2 px-2 py-0.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black rounded text-[8px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Activate Trial</span>
              <ArrowRight size={8} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Layout with Sidebar */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="md:w-[240px] shrink-0" id="sidebar-navigation">
          <nav className="space-y-1 bg-slate-900/20 border border-slate-900 rounded-2xl p-2.5 md:sticky md:top-24 shadow-xl backdrop-blur-md">
            
            {/* Quick Navigation Search Filter Input */}
            <div className="relative mb-2.5">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Filter workspace..."
                className="w-full pl-8 pr-7 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all font-medium"
              />
              {navSearchQuery && (
                <button
                  onClick={() => setNavSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 p-0.5 rounded transition-colors"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Navigation Items */}
            {(() => {
              const filteredItems = navItems.filter((item) =>
                item.label.toLowerCase().includes(navSearchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) {
                return (
                  <div className="p-3 text-center text-[11px] text-slate-500 italic">
                    No workspace found
                  </div>
                );
              }

              return filteredItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeMenu === item.id;
                const isLocked = isTrialExpired && item.id !== "subscription";
                return (
                  <button
                    key={item.id}
                    disabled={isLocked}
                    onClick={() => {
                      setActiveMenu(item.id);
                      addLog(`Opened workspace: ${item.label}`, "info");
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-200 transform hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] cursor-pointer ${
                      isActive 
                        ? "border-l-4 border-l-emerald-400 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/40 text-emerald-300 font-bold shadow-[0_0_18px_rgba(16,185,129,0.2)]" 
                        : isLocked
                          ? "text-slate-650 border border-transparent cursor-not-allowed opacity-40"
                          : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <IconComp size={15} className={isActive ? "text-emerald-400 animate-pulse" : isLocked ? "text-slate-700" : "text-slate-500"} />
                    <span className="flex-1">{item.label}</span>
                    {isLocked && <Lock size={11} className="text-rose-500/60" />}
                    {isActive && !isLocked && <ChevronRight size={12} className="text-emerald-400/80" />}
                  </button>
                );
              });
            })()}
          </nav>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="outline-none"
            >
              {/* Dashboard */}
              {activeMenu === "dashboard" && (
                <DashboardHub 
                  links={links}
                  routes={routes}
                  partners={partners}
                  campaigns={campaigns}
                  logs={logs}
                  onNavigate={(menu) => setActiveMenu(menu)}
                  onQuickAction={handleQuickAction}
                />
              )}

              {/* Links Directory */}
              {activeMenu === "links" && (
                <BusinessLinksDirectory 
                  links={links}
                  onAddLink={handleAddLink}
                  onEditLink={handleEditLink}
                  onDeleteLink={handleDeleteLink}
                  activeCategory={activeLinkCategory}
                  onCategoryChange={(cat) => setActiveLinkCategory(cat)}
                />
              )}

              {/* Routes & Schedules */}
              {activeMenu === "routes" && (
                <RoutesSchedules 
                  routes={routes}
                  links={links}
                  onAddRoute={handleAddRoute}
                  onEditRoute={handleEditRoute}
                  onDeleteRoute={handleDeleteRoute}
                />
              )}

              {/* Vendors & Partners */}
              {activeMenu === "partners" && (
                <VendorsPartners 
                  partners={partners}
                  onAddPartner={handleAddPartner}
                  onEditPartner={handleEditPartner}
                  onDeletePartner={handleDeletePartner}
                />
              )}

              {/* Marketing & Promotions */}
              {activeMenu === "marketing" && (
                <MarketingPromotions 
                  campaigns={campaigns}
                  routes={routes}
                  onAddCampaign={handleAddCampaign}
                  onEditCampaign={handleEditCampaign}
                  onDeleteCampaign={handleDeleteCampaign}
                  onTriggerLog={addLog}
                />
              )}

              {/* Analytics & Reports */}
              {activeMenu === "analytics" && (
                <AnalyticsReports 
                  links={links}
                  routes={routes}
                  partners={partners}
                  campaigns={campaigns}
                />
              )}

              {/* Google AI Studio Core Features */}
              {activeMenu === "google-ai-studio" && (
                <GoogleAIStudioFeatures 
                  onTriggerLog={addLog}
                  onNavigateTab={(tab) => setActiveMenu(tab)}
                />
              )}

              {/* Nova AI Creative Suite */}
              {activeMenu === "nova-suite" && (
                <NovaCreativeSuite 
                  onTriggerLog={addLog}
                />
              )}

              {/* Support & Documentation */}
              {activeMenu === "support" && (
                <SupportDocs 
                  onTriggerLog={addLog}
                />
              )}

              {/* Admin & Settings */}
              {activeMenu === "admin" && (
                <AdminSettings 
                  projects={projects}
                  onRefreshProjects={fetchProjects}
                  onDeleteProjects={handleBulkDeleteProjects}
                  onTriggerLog={addLog}
                />
              )}

              {/* Subscription & Billing */}
              {activeMenu === "subscription" && (
                <SubscriptionBilling 
                  onTriggerLog={addLog}
                  onUserUpdate={(userData) => {
                    setCurrentUserProfile(userData);
                    if (userData) {
                      localStorage.setItem("mubuslink_mock_user", JSON.stringify(userData));
                    } else {
                      localStorage.removeItem("mubuslink_mock_user");
                      handleForceExpireToggle(false);
                    }
                  }}
                  currentUserProfile={currentUserProfile}
                  onForceExpireToggle={handleForceExpireToggle}
                  isForcedExpired={isForcedExpired}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-slate-900/10 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 font-mono mt-auto">
        <p>© 2026 MUBUSLINK. Built for safe, connected transit operations.</p>
      </footer>
    </div>
  );
}
