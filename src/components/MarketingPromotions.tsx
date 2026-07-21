import { useState } from "react";
import { 
  Megaphone, 
  TrendingUp, 
  Calendar, 
  Ticket, 
  ExternalLink, 
  Plus, 
  Edit, 
  Trash2, 
  Sparkles, 
  Code, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Check, 
  Eye, 
  Globe, 
  Settings,
  HelpCircle,
  X
} from "lucide-react";
import { Campaign, Route } from "../types";

interface MarketingPromotionsProps {
  campaigns: Campaign[];
  routes: Route[];
  onAddCampaign: (campaign: Omit<Campaign, "id" | "metrics">) => void;
  onEditCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onTriggerLog: (msg: string, type: "info" | "success" | "warning") => void;
}

export default function MarketingPromotions({
  campaigns,
  routes,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onTriggerLog
}: MarketingPromotionsProps) {
  const [activeTab, setActiveTab] = useState<"campaigns" | "seo_creator">("campaigns");
  
  // Campaign form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [campName, setCampName] = useState("");
  const [campChannel, setCampChannel] = useState("");
  const [campStart, setCampStart] = useState("");
  const [campEnd, setCampEnd] = useState("");
  const [campStatus, setCampStatus] = useState("active");
  const [campLanding, setCampLanding] = useState("");
  const [campCodes, setCampCodes] = useState("");
  const [campRoutes, setCampRoutes] = useState<string[]>([]);
  const [isAiGeneratingCamp, setIsAiGeneratingCamp] = useState(false);

  // SEO / AI Website Generator states
  const [businessName, setBusinessName] = useState("Mubuslink Seattle Express");
  const [audience, setAudience] = useState("Cascadia Weekend Travelers");
  const [tone, setTone] = useState("Professional");
  const [services, setServices] = useState("Seattle to Portland Express Bus Service");
  const [brandStyle, setBrandStyle] = useState("Aesthetic Minimalist, Teal Obsidian and Ice Gray");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated landing page sitemap output
  const [siteOutput, setSiteOutput] = useState<{
    sitemap: string[];
    pages: {
      [key: string]: {
        sections: string[];
        html: string;
      };
    };
    seo: {
      title: string;
      meta_description: string;
      keywords: string[];
    };
  } | null>(null);

  // SEO Manual Editor state (active editing copy of siteOutput.seo)
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState("");

  // Preview Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [selectedPreviewPage, setSelectedPreviewPage] = useState("home");

  const openAddCamp = () => {
    setCampName("");
    setCampChannel("");
    setCampStart("");
    setCampEnd("");
    setCampStatus("active");
    setCampLanding("");
    setCampCodes("");
    setCampRoutes([]);
    setIsAddModalOpen(true);
  };

  const submitAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campChannel) return;
    onAddCampaign({
      name: campName,
      channel: campChannel,
      startDate: campStart || new Date().toISOString().split("T")[0],
      endDate: campEnd || new Date(Date.now() + 2592000000).toISOString().split("T")[0],
      status: campStatus,
      landingPage: campLanding || "https://mubuslink.ai.studio/marketing/promo",
      promoCodes: campCodes.split(",").map(c => c.trim()).filter(Boolean),
      targetRoutes: campRoutes
    });
    setIsAddModalOpen(false);
    onTriggerLog(`Promotional Campaign '${campName}' launched successfully.`, "success");
  };

  const handleAiSuggestCampaign = async () => {
    setIsAiGeneratingCamp(true);
    onTriggerLog("Consulting Gemini marketer to draft high-converting corporate promotion campaigns...", "info");
    try {
      const prompt = `Generate a single highly professional promotional campaign for a transit bus platform (MUBUSLINK system).
Generate a single raw JSON object only. Do NOT enclose in markdown code fences or backticks. Follow this exact schema:
{
  "name": "A high-fidelity campaign name (e.g. Cascadia Fall Commuter Pass, Weekend Wine Country Shuttle Promo, Puget Sound Eco-Discount)",
  "channel": "The marketing channel (e.g. Email Newsletter, Regional Press, Mobile Push, Social Media Ads)",
  "landingPage": "https://mubuslink.ai.studio/marketing/promo",
  "promoCodes": ["PROMO10", "ECOTRAVEL26"], 
  "targetRoutes": [] 
}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, tone: "Professional" })
      });
      const data = await res.json();
      if (data && data.text) {
        let cleanText = data.text.trim();
        if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        }
        const parsed = JSON.parse(cleanText);
        
        const todayStr = new Date().toISOString().split("T")[0];
        const monthLaterStr = new Date(Date.now() + 2592000000).toISOString().split("T")[0];

        onAddCampaign({
          name: parsed.name || "AI Promo Campaign",
          channel: parsed.channel || "Social Media Ads",
          startDate: todayStr,
          endDate: monthLaterStr,
          status: "active",
          landingPage: parsed.landingPage || "https://mubuslink.ai.studio/marketing/promo",
          promoCodes: parsed.promoCodes || ["AITRAVEL"],
          targetRoutes: parsed.targetRoutes || []
        });
        
        onTriggerLog(`AI Orchestrator successfully scheduled promo: "${parsed.name}" starting today!`, "success");
      } else {
        throw new Error("No text response from Gemini");
      }
    } catch (e) {
      console.warn("AI Campaign generation error, using fallback values:", e);
      const todayStr = new Date().toISOString().split("T")[0];
      const monthLaterStr = new Date(Date.now() + 2592000000).toISOString().split("T")[0];
      const fallbackList = [
        {
          name: "Cascadia Fall Commuter Pass",
          channel: "Email Newsletter",
          startDate: todayStr,
          endDate: monthLaterStr,
          status: "active",
          landingPage: "https://mubuslink.ai.studio/marketing/promo",
          promoCodes: ["FALLPASS26", "COMMUTE15"],
          targetRoutes: []
        },
        {
          name: "Weekend Wine Country Shuttle Promo",
          channel: "Social Media Ads",
          startDate: todayStr,
          endDate: monthLaterStr,
          status: "active",
          landingPage: "https://mubuslink.ai.studio/marketing/promo",
          promoCodes: ["WINEWEEKEND", "SHUTTLE10"],
          targetRoutes: []
        }
      ];
      const selected = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      onAddCampaign(selected);
      onTriggerLog(`AI Fallback campaign scheduled: "${selected.name}" with current dates.`, "success");
    } finally {
      setIsAiGeneratingCamp(false);
    }
  };

  // AI Generation Proxy logic
  const handleGenerateLandingPage = async () => {
    setIsGenerating(true);
    onTriggerLog("Initializing Central AI model to orchestrate SEO landing page...", "info");
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "website",
          inputs: { businessName, jurisdictions: "Cascadia Corridor", audience, tone, services, brandStyle }
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const siteData = resJson.data;
        setSiteOutput(siteData);
        // Initialize the manual SEO editor fields
        if (siteData.seo) {
          setSeoTitle(siteData.seo.title || `${businessName} - Premium Travel`);
          setSeoDescription(siteData.seo.meta_description || `Travel Seattle to Portland on ${businessName}`);
          setSeoKeywords(siteData.seo.keywords || ["bus links", "transit", "washington"]);
        }
        onTriggerLog("AI Website orchestrator successfully generated landing page layout & SEO meta profiles.", "success");
      } else {
        throw new Error(resJson.error || "Generation endpoint returned failure");
      }
    } catch (err: any) {
      console.warn("AI website generator failed, using robust offline fallback templates", err);
      // Fallback data
      const mockResult = {
        sitemap: ["home", "about", "services", "contact"],
        pages: {
          home: {
            sections: ["Hero Banner", "Route Timetable Highlights", "Customer Perks"],
            html: `
              <div class="bg-slate-950 p-8 text-white text-center rounded-xl space-y-6">
                <h2 class="text-3xl font-black text-emerald-400 font-display">${businessName}</h2>
                <p class="text-xs text-slate-400 max-w-md mx-auto">${services}</p>
                <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-sm mx-auto space-y-4">
                  <h3 class="text-xs font-bold uppercase text-indigo-400 font-mono">Book Direct & Save 15%</h3>
                  <p class="text-[10px] text-slate-500 font-mono">Use Promo Code: <span class="bg-slate-950 px-2 py-1 border border-slate-800 text-emerald-400 rounded font-bold">SUMMER26</span></p>
                  <button class="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Reserve Seat</button>
                </div>
              </div>
            `
          },
          about: {
            sections: ["History", "SLA Credentials"],
            html: `
              <div class="bg-slate-950 p-8 text-white rounded-xl space-y-4">
                <h2 class="text-xl font-bold font-display">About ${businessName}</h2>
                <p class="text-xs text-slate-400 leading-relaxed">Operating safe, carbon-neutral EV express routes across the regional corridors. Our transit compliance protocols exceed federal guidelines.</p>
              </div>
            `
          }
        },
        seo: {
          title: `${businessName} | Cascadia Transit Operator`,
          meta_description: `Official promo page for ${businessName}. ${services}. Designed for ${audience}.`,
          keywords: ["transit", "eco-friendly coach", "commute", "promo links"]
        }
      };
      setSiteOutput(mockResult);
      setSeoTitle(mockResult.seo.title);
      setSeoDescription(mockResult.seo.meta_description);
      setSeoKeywords(mockResult.seo.keywords);
      onTriggerLog("Local sitemap layouts compiled as secure offline fallback.", "success");
    } finally {
      setIsGenerating(false);
    }
  };

  // SEO Editor Handlers
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    if (!seoKeywords.includes(newKeywordInput.trim())) {
      setSeoKeywords([...seoKeywords, newKeywordInput.trim()]);
    }
    setNewKeywordInput("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setSeoKeywords(seoKeywords.filter(kw => kw !== kwToRemove));
  };

  const handleSaveSeoChanges = () => {
    if (!siteOutput) return;
    setSiteOutput({
      ...siteOutput,
      seo: {
        title: seoTitle,
        meta_description: seoDescription,
        keywords: seoKeywords
      }
    });
    onTriggerLog("Sitemap meta headers manually updated and saved.", "success");
  };

  return (
    <div className="space-y-6" id="marketing-promotions">
      {/* Tab select */}
      <div className="flex border-b border-slate-900 gap-6 font-display">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 text-xs uppercase tracking-wider font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "campaigns" ? "border-emerald-500 text-emerald-400 font-black" : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          Promotional Campaigns
        </button>
        <button
          onClick={() => setActiveTab("seo_creator")}
          className={`pb-3 text-xs uppercase tracking-wider font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "seo_creator" ? "border-emerald-500 text-emerald-400 font-black" : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          SEO & Landing Page Creator
        </button>
      </div>

      {activeTab === "campaigns" ? (
        <div className="space-y-6">
          {/* Dashboard and Actions Row */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-widest pl-1">Live Campaigns Metrics</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAiSuggestCampaign}
                disabled={isAiGeneratingCamp}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer select-none"
                title="Use Gemini AI to dynamically draft a high-converting marketing campaign with current dates"
              >
                <Sparkles size={14} className={isAiGeneratingCamp ? "animate-spin" : ""} />
                <span>{isAiGeneratingCamp ? "Drafting..." : "AI Suggest Promo"}</span>
              </button>

              <button 
                onClick={openAddCamp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer select-none"
              >
                <Plus size={14} className="font-black" />
                <span>Launch New Promo</span>
              </button>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {campaigns.map((camp) => (
              <div 
                key={camp.id}
                className="bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-900/50 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div>
                      <h4 className="text-xs font-black text-white select-text">{camp.name}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold font-mono block mt-0.5">{camp.channel}</span>
                    </div>

                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                      camp.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      camp.status === "draft" ? "bg-slate-950 text-slate-500 border border-slate-900" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  {/* Dates & Target Routes */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-900/60 py-3.5 text-[10px] font-mono select-text text-slate-400">
                    <div className="space-y-1">
                      <span className="text-[8px] text-slate-500 uppercase font-black block">Duration</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-slate-600" />
                        <span>{camp.startDate} to {camp.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[8px] text-slate-500 uppercase font-black block">Linked Routes</span>
                      <div className="flex items-center gap-1.5">
                        <Globe size={11} className="text-slate-600" />
                        <span>{camp.targetRoutes.length > 0 ? camp.targetRoutes.map(rid => rid.replace("route-", "#")).join(", ") : "Global"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo codes & landing link */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2 text-[11px] font-mono select-text">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Promo Codes:</span>
                      <div className="flex gap-1.5">
                        {camp.promoCodes.map((code, ci) => (
                          <span key={ci} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-black text-[9px]">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-slate-400 pt-1.5 border-t border-slate-900/60">
                      <span>Landing:</span>
                      <a 
                        href={camp.landingPage} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-[150px]">Link Portal</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Metrics report */}
                <div className="grid grid-cols-3 gap-1 pt-4 border-t border-slate-900/60 mt-4 select-text">
                  <div className="text-center">
                    <span className="text-[8px] text-slate-500 uppercase font-black block">Clicks</span>
                    <span className="text-xs font-black text-white mt-1 block">{camp.metrics.clicks.toLocaleString()}</span>
                  </div>
                  <div className="text-center border-x border-slate-900">
                    <span className="text-[8px] text-slate-500 uppercase font-black block">Conversions</span>
                    <span className="text-xs font-black text-white mt-1 block">{camp.metrics.conversions.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-slate-500 uppercase font-black block">SLA Sales</span>
                    <span className="text-xs font-black text-emerald-400 mt-1 block">${camp.metrics.ticketSales.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-slate-900/40 mt-3">
                  <button 
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SEO & Website Builder with SEO manual editor and Preview modal */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest pl-1 flex items-center gap-2">
              <Sparkles size={13} className="text-emerald-400" />
              <span>AI Landing Page Builder</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Bus Brand / Sub-name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Promo Audience</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Core Campaign Offer</label>
                <textarea 
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Brand Theme & Styles</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={brandStyle}
                  onChange={(e) => setBrandStyle(e.target.value)}
                />
              </div>

              <button 
                onClick={handleGenerateLandingPage}
                disabled={isGenerating}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
              >
                {isGenerating ? (
                  <>
                    <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Site Specs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="font-black" />
                    <span>Generate Landing Pages</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SEO Manual Editor & Site Output (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {siteOutput ? (
              <div className="space-y-6">
                
                {/* SEO & Meta Manual Editor component (Requested in Checkpoint 1, #2) */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h4 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest pl-1 flex items-center gap-2">
                      <Code size={13} className="text-emerald-400" />
                      <span>Sitemap SEO & Metadata Editor</span>
                    </h4>
                    <span className="text-[8px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold rounded">MANUAL OVERRIDE</span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Meta Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-150 outline-none"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Meta Description Summary</label>
                      <textarea 
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-150 outline-none resize-none"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                      />
                    </div>

                    {/* Interactive Keywords editor */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Keyword list</label>
                      
                      {/* Keyword tags bubble container */}
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/60 border border-slate-900 rounded-xl min-h-[44px] mb-2.5">
                        {seoKeywords.length === 0 ? (
                          <span className="text-[10px] text-slate-600 italic px-2 py-1">No metadata keywords.</span>
                        ) : (
                          seoKeywords.map((kw, kwi) => (
                            <span key={kwi} className="text-[9px] font-mono px-2 py-1 bg-slate-900 border border-slate-850 text-slate-300 rounded-lg flex items-center gap-1 select-all">
                              <span>{kw}</span>
                              <button 
                                type="button"
                                onClick={() => handleRemoveKeyword(kw)}
                                className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer font-black"
                              >
                                ✕
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      {/* Add keyword form field */}
                      <form onSubmit={handleAddKeyword} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type keyword and press Enter..."
                          className="flex-1 bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-1.5 text-slate-150 outline-none text-xs"
                          value={newKeywordInput}
                          onChange={(e) => setNewKeywordInput(e.target.value)}
                        />
                        <button 
                          type="submit"
                          className="px-3 py-1.5 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl text-slate-300 font-bold text-[10px]"
                        >
                          Add tag
                        </button>
                      </form>
                    </div>

                    {/* Save Overrides */}
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={handleSaveSeoChanges}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md select-none cursor-pointer font-sans"
                      >
                        <Check size={13} className="font-bold" />
                        <span>Save Meta Headers</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Page output and preview triggers */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest pl-1">Generated Pages Sitemap</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Click preview to launch responsive inspector.</p>
                    </div>
                    
                    {/* Preview trigger */}
                    <button 
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md select-none cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Responsive Live Preview</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {Object.keys(siteOutput.pages || {}).map((pageKey) => {
                      const p = siteOutput.pages[pageKey];
                      return (
                        <div key={pageKey} className="p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-850 rounded-2xl flex items-center justify-between transition-all">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 font-mono uppercase">/{pageKey}</span>
                            <div className="flex gap-2 text-[10px] text-slate-500 font-mono mt-1 select-all">
                              <span>Blocks: {p.sections?.join(" ➔ ")}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setSelectedPreviewPage(pageKey);
                              setIsPreviewModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-9 Seattle hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white rounded-lg text-[10px]"
                          >
                            Preview
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-3xl border-dashed">
                <Sparkles size={40} className="text-slate-600 mx-auto mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-400">Specify Site Brand parameters and click generate.</h4>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CAMPAIGN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Launch Promotional Campaign</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitAddCampaign} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Summer Cascadia Explorer"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Ad Channel</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Social & Retargeting, Email Newsletter"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={campChannel}
                  onChange={(e) => setCampChannel(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={campStart}
                    onChange={(e) => setCampStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={campEnd}
                    onChange={(e) => setCampEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={campStatus}
                    onChange={(e) => setCampStatus(e.target.value)}
                  >
                    <option value="active">Active (Deploy Now)</option>
                    <option value="paused">Paused</option>
                    <option value="draft">Draft / Schedule</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Promo Codes (Comma Sep)</label>
                  <input 
                    type="text" 
                    placeholder="SUMMER26, EXPLORE"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={campCodes}
                    onChange={(e) => setCampCodes(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Landing Page URL</label>
                <input 
                  type="url" 
                  placeholder="https://mubuslink.ai/cascadia-summer"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={campLanding}
                  onChange={(e) => setCampLanding(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Routes</label>
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-900 max-h-[110px] overflow-y-auto">
                  {routes.map((route) => {
                    const isChecked = campRoutes.includes(route.id);
                    return (
                      <label key={route.id} className="flex items-center gap-2 py-1 select-none text-slate-350 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setCampRoutes(prev => prev.filter(id => id !== route.id));
                            } else {
                              setCampRoutes(prev => [...prev, route.id]);
                            }
                          }}
                          className="rounded text-emerald-500 border-slate-800 bg-slate-900 focus:ring-emerald-500"
                        />
                        <span>{route.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl uppercase font-bold text-[10px] tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-slate-950 rounded-xl uppercase font-bold text-[10px] tracking-wider transition-all"
                >
                  Onboard Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESPONSIVE WEBSITE PREVIEW MODAL (Requested in Checkpoint 1, #2) */}
      {isPreviewModalOpen && siteOutput && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-between animate-fade-in">
          {/* Modal header */}
          <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[8px] font-black text-emerald-400 font-mono uppercase">WEBSITE BUILDER LIVE VIEWER</span>
                <h3 className="text-xs font-black text-white">{seoTitle || businessName}</h3>
              </div>
              
              {/* Device toggles */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0 select-none">
                <button 
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "mobile" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-slate-300"}`}
                  title="Mobile View"
                >
                  <Smartphone size={13} />
                </button>
                <button 
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "tablet" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-slate-300"}`}
                  title="Tablet View"
                >
                  <Tablet size={13} />
                </button>
                <button 
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${previewDevice === "desktop" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-slate-300"}`}
                  title="Desktop View"
                >
                  <Monitor size={13} />
                </button>
              </div>
            </div>

            {/* Page selection within mock preview */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">Mock URL Path:</span>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 border border-slate-850 rounded-lg text-[10px] font-mono text-emerald-400 select-all font-bold">
                https://mubuslink.ai/{selectedPreviewPage}
              </div>

              <select 
                className="bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2 py-1 text-[10px] outline-none font-mono"
                value={selectedPreviewPage}
                onChange={(e) => setSelectedPreviewPage(e.target.value)}
              >
                {Object.keys(siteOutput.pages || {}).map((pKey) => (
                  <option key={pKey} value={pKey}>/{pKey}</option>
                ))}
              </select>

              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 text-slate-500 hover:text-white cursor-pointer ml-3 font-black"
                title="Close preview"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Device viewport frame simulation */}
          <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
            <div 
              className={`bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl transition-all overflow-hidden flex flex-col ${
                previewDevice === "mobile" ? "w-[360px] h-[640px]" :
                previewDevice === "tablet" ? "w-[768px] h-[900px] max-h-full" :
                "w-full h-full"
              }`}
            >
              {/* Responsive Iframe container simulation */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-4">
                <div 
                  className="markdown-body select-text"
                  dangerouslySetInnerHTML={{ 
                    __html: siteOutput.pages[selectedPreviewPage]?.html || "<p class='text-center text-slate-500 italic py-10'>Page not generated.</p>" 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
