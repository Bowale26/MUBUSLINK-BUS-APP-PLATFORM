import { useState, useMemo } from "react";
import { 
  Globe, 
  Search, 
  Plus, 
  ExternalLink, 
  Clock, 
  Tag, 
  CheckCircle, 
  Edit, 
  Trash2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { BusinessLink } from "../types";

interface BusinessLinksDirectoryProps {
  links: BusinessLink[];
  onAddLink: (link: Omit<BusinessLink, "id" | "lastUpdated">) => void;
  onEditLink: (link: BusinessLink) => void;
  onDeleteLink: (id: string) => void;
  activeCategory: string; // "all", "operations", "finance", "hr_training", "legal_compliance", "external"
  onCategoryChange: (category: string) => void;
  onTriggerLog?: (msg: string, type: "info" | "success" | "warning") => void;
}

export default function BusinessLinksDirectory({
  links,
  onAddLink,
  onEditLink,
  onDeleteLink,
  activeCategory,
  onCategoryChange,
  onTriggerLog
}: BusinessLinksDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<BusinessLink["category"]>("operations");
  const [formTags, setFormTags] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter and search
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchCategory = activeCategory === "all" || link.category === activeCategory;
      const matchSearch = searchTerm === "" || 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [links, activeCategory, searchTerm]);

  // Handle forms
  const openAdd = () => {
    setFormTitle("");
    setFormDesc("");
    setFormCategory("operations");
    setFormTags("");
    setFormUrl("");
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (link: BusinessLink) => {
    setFormTitle(link.title);
    setFormDesc(link.description);
    setFormCategory(link.category);
    setFormTags(link.tags.join(", "));
    setFormUrl(link.url);
    setEditingId(link.id);
    setIsEditModalOpen(true);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formUrl) return;
    onAddLink({
      title: formTitle,
      description: formDesc,
      category: formCategory,
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
      url: formUrl
    });
    setIsAddModalOpen(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formTitle || !formUrl) return;
    onEditLink({
      id: editingId,
      title: formTitle,
      description: formDesc,
      category: formCategory,
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
      url: formUrl,
      lastUpdated: new Date().toISOString()
    });
    setIsEditModalOpen(false);
  };

  const handleAiSuggest = async () => {
    setIsAiGenerating(true);
    if (onTriggerLog) onTriggerLog("Activating Gemini Orchestrator to generate transit directories...", "info");
    try {
      const prompt = `Generate a single realistic corporate business link or internal resource link for a public transport bus system (MUBUSLINK).
Generate a single raw JSON object only. Do NOT enclose in markdown code fences or backticks. Follow this exact schema:
{
  "title": "A highly professional and realistic tool or directory name (e.g. Cascadia Regional Hub portal, Bus Dispatch Control Board, Fleet Fueling SLA Tracking)",
  "description": "A high-fidelity description outlining how operators or staff use this tool/URL",
  "category": "operations", 
  "tags": ["Dispatch", "SLA", "Cascadia"],
  "url": "https://mubuslink.ai.studio/portals/ops"
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
        
        onAddLink({
          title: parsed.title || "AI Generated Tool",
          description: parsed.description || "Auto-generated internal resource",
          category: parsed.category || "operations",
          tags: parsed.tags || ["AI-Generated"],
          url: parsed.url || "https://example.com"
        });
        
        if (onTriggerLog) {
          onTriggerLog(`AI Orchestrator successfully cataloged: "${parsed.title}" (Dated: Today)`, "success");
        }
      } else {
        throw new Error("No text response from Gemini");
      }
    } catch (e) {
      console.warn("AI generation error, using fallback dynamic values:", e);
      const fallbackList = [
        {
          title: "IntelliRoute Fuel Optimizer",
          description: "Smart algorithmic tracking system for fleet fuel consumption optimization based on active mileage.",
          category: "finance" as const,
          tags: ["Fuel", "Analytics", "Optimization"],
          url: "https://mubuslink.ai.studio/finance/fuel"
        },
        {
          title: "SLA Safety Incident Database",
          description: "Internal regulatory log for registering, cataloging, and dispatching safety and service alerts.",
          category: "legal_compliance" as const,
          tags: ["SLA", "Compliance", "Safety"],
          url: "https://mubuslink.ai.studio/compliance/log"
        },
        {
          title: "Operator Certification Dashboard",
          description: "Compliance records and active training workflows for transit drivers and dispatchers.",
          category: "hr_training" as const,
          tags: ["Training", "HR", "Certification"],
          url: "https://mubuslink.ai.studio/hr/training"
        }
      ];
      const selected = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      onAddLink(selected);
      if (onTriggerLog) {
        onTriggerLog(`AI Fallback cataloged: "${selected.title}" (Dated: Today)`, "success");
      }
    } finally {
      setIsAiGenerating(false);
    }
  };

  const categoriesList: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All Directories", count: links.length },
    { id: "operations", label: "Operations", count: links.filter(l => l.category === "operations").length },
    { id: "finance", label: "Finance", count: links.filter(l => l.category === "finance").length },
    { id: "hr_training", label: "HR & Training", count: links.filter(l => l.category === "hr_training").length },
    { id: "legal_compliance", label: "Legal & Compliance", count: links.filter(l => l.category === "legal_compliance").length },
    { id: "external", label: "External Services", count: links.filter(l => l.category === "external").length },
  ];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "operations": return "Operations";
      case "finance": return "Finance";
      case "hr_training": return "HR & Training";
      case "legal_compliance": return "Legal & Compliance";
      case "external": return "External Services";
      default: return cat;
    }
  };

  return (
    <div className="space-y-6" id="links-directory">
      {/* Category Toggles and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/20 p-4 border border-slate-900 rounded-3xl">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950 border border-slate-900 rounded-xl max-w-md w-full">
          <Search size={14} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search business links, tags, directories..." 
            className="bg-transparent text-xs text-slate-100 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleAiSuggest}
            disabled={isAiGenerating}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer select-none"
            title="Use Gemini AI to dynamically draft a realistic public transport directory link with current date"
          >
            <Sparkles size={14} className={isAiGenerating ? "animate-spin" : ""} />
            <span>{isAiGenerating ? "AI Drafting..." : "AI Suggest Link"}</span>
          </button>

          <button 
            onClick={openAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer select-none"
          >
            <Plus size={14} className="font-black" />
            <span>Add Business Link</span>
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 border ${
              activeCategory === cat.id
                ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold"
                : "border-slate-900 bg-slate-950/45 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <span>{cat.label}</span>
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono ${
              activeCategory === cat.id ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-900 text-slate-500"
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid of link cards */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/15 rounded-3xl border border-slate-900 border-dashed">
          <Globe size={32} className="text-slate-600 mx-auto mb-3 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-400">No Business Links Found</h4>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[280px] mx-auto">No business resources match your category filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="links-grid">
          {filteredLinks.map((link) => (
            <div 
              key={link.id}
              className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    link.category === "operations" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    link.category === "finance" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    link.category === "hr_training" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    link.category === "legal_compliance" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {getCategoryLabel(link.category)}
                  </span>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEdit(link)}
                      className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-900 transition-colors"
                      title="Edit link details"
                    >
                      <Edit size={11} />
                    </button>
                    <button 
                      onClick={() => onDeleteLink(link.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900 transition-colors"
                      title="Delete link"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1.5 flex items-center gap-1.5 select-text">
                  <span>{link.title}</span>
                </h4>
                
                <p className="text-xs text-slate-400 leading-normal mb-4 select-text">
                  {link.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-900/60 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  {link.tags.map((tag, ti) => (
                    <span key={ti} className="text-[9px] px-1.5 py-0.5 bg-slate-950/60 text-slate-500 rounded border border-slate-900 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{new Date(link.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  
                  <a 
                    href={link.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold group-hover:underline"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Add Business Link</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitAdd} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Fleet Maintenance Portal"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Summarize what this tool or URL is used for..."
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                  >
                    <option value="operations">Operations</option>
                    <option value="finance">Finance</option>
                    <option value="hr_training">HR & Training</option>
                    <option value="legal_compliance">Legal & Compliance</option>
                    <option value="external">External Services</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tags (Comma Sep)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., GPS, Fleet, Realtime"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
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
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Edit Business Link</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea 
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                  >
                    <option value="operations">Operations</option>
                    <option value="finance">Finance</option>
                    <option value="hr_training">HR & Training</option>
                    <option value="legal_compliance">Legal & Compliance</option>
                    <option value="external">External Services</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tags (Comma Sep)</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource URL</label>
                <input 
                  type="url" 
                  required
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl uppercase font-bold text-[10px] tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-slate-950 rounded-xl uppercase font-bold text-[10px] tracking-wider transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
