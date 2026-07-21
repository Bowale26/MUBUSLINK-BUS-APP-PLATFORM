import React, { useState, useMemo } from "react";
import { 
  Globe, 
  Search, 
  Plus, 
  ExternalLink, 
  Clock, 
  Tag as TagIcon, 
  Edit, 
  Trash2,
  Settings,
  DollarSign,
  Headphones,
  TrendingUp,
  Users,
  MapPin,
  BarChart3,
  ArrowRight,
  Filter,
  Download,
  Upload,
  Shield,
  Layers,
  FileText,
  Copy,
  Check,
  Eye,
  SortAsc,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Info
} from "lucide-react";
import { BusinessLink, CategorySchema, TagSchema, DirectorySourceSchema } from "../types";
import { initialCategories, initialDirectorySources, initialTags } from "../data";

interface BusinessLinksDirectoryProps {
  links: BusinessLink[];
  onAddLink: (link: Omit<BusinessLink, "id" | "lastUpdated">) => void;
  onEditLink: (link: BusinessLink) => void;
  onDeleteLink: (id: string) => void;
  activeCategory: string; // "all", "operations", "finance", "customer-services", "marketing", "partners-vendors", "local-profiles", "company-intelligence"
  onCategoryChange: (category: string) => void;
}

export default function BusinessLinksDirectory({
  links,
  onAddLink,
  onEditLink,
  onDeleteLink,
  activeCategory,
  onCategoryChange
}: BusinessLinksDirectoryProps) {
  // Navigation tab state matching internal routes
  const [currentRoute, setCurrentRoute] = useState<string>("/business-links"); // "/business-links", "/business-links/:category", "/business-links/search", "/business-links/admin"
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  // Category & Schema states (Admin managed)
  const [categories, setCategories] = useState<CategorySchema[]>(initialCategories);
  const [directorySources, setDirectorySources] = useState<DirectorySourceSchema[]>(initialDirectorySources);
  const [tagsList, setTagsList] = useState<TagSchema[]>(initialTags);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [filterDirectorySource, setFilterDirectorySource] = useState("all");
  const [sortBy, setSortBy] = useState<"alphabetical" | "recently-updated" | "most-clicked">("recently-updated");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Admin permission role
  const [userRole, setUserRole] = useState<"Admin" | "Manager" | "Viewer">("Admin");

  // Admin form management states
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newDirName, setNewDirName] = useState("");
  const [newDirHome, setNewDirHome] = useState("");

  // Link Add/Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("operations");
  const [formTags, setFormTags] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formDirSource, setFormDirSource] = useState("Internal Directory");
  const [formNotes, setFormNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Copy URL state
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Settings": return <Settings size={18} className="text-emerald-400" />;
      case "DollarSign": return <DollarSign size={18} className="text-blue-400" />;
      case "Headphones": return <Headphones size={18} className="text-indigo-400" />;
      case "TrendingUp": return <TrendingUp size={18} className="text-amber-400" />;
      case "Users": return <Users size={18} className="text-purple-400" />;
      case "MapPin": return <MapPin size={18} className="text-rose-400" />;
      case "BarChart3": return <BarChart3 size={18} className="text-cyan-400" />;
      default: return <Layers size={18} className="text-emerald-400" />;
    }
  };

  // Helper for Category Name
  const getCategoryName = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : catId;
  };

  // Internal Routes list for display
  const internalRoutesList = [
    { label: "Directory Overview", path: "/business-links" },
    { label: "Operations Category", path: "/business-links/operations" },
    { label: "Marketing Category", path: "/business-links/marketing" },
    { label: "Search & Filter Hub", path: "/business-links/search" },
    { label: "Directory Admin Panel", path: "/business-links/admin" }
  ];

  // Route Handler
  const handleNavigate = (route: string, categoryId?: string) => {
    setCurrentRoute(route);
    if (categoryId) {
      onCategoryChange(categoryId);
      setFilterCategory(categoryId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Filter & Search Logic
  const filteredAndSortedLinks = useMemo(() => {
    return links.filter(link => {
      // Route / Category filter
      const matchCat = filterCategory === "all" || link.category === filterCategory;
      // Tag filter
      const matchTag = filterTag === "all" || link.tags.includes(filterTag);
      // Directory Source filter
      const matchSource = filterDirectorySource === "all" || link.directorySource === filterDirectorySource;
      // Text search
      const q = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "" || 
        link.title.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q) ||
        link.notes.toLowerCase().includes(q) ||
        link.directorySource.toLowerCase().includes(q) ||
        link.tags.some(t => t.toLowerCase().includes(q));

      return matchCat && matchTag && matchSource && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "most-clicked") {
        return (b.clicks || 0) - (a.clicks || 0);
      } else {
        // recently-updated
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });
  }, [links, filterCategory, filterTag, filterDirectorySource, searchQuery, sortBy]);

  // Paginated Results
  const totalPages = Math.ceil(filteredAndSortedLinks.length / itemsPerPage) || 1;
  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLinks.slice(start, start + itemsPerPage);
  }, [filteredAndSortedLinks, currentPage]);

  // Selected link object for detail view
  const selectedLink = useMemo(() => {
    return links.find(l => l.id === selectedLinkId) || null;
  }, [links, selectedLinkId]);

  // AI-Powered Link Generator & Auto-Fill Tool
  const handleAIAutoFillLink = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setFormTitle(`AI Portal Hub - ${today}`);
    setFormDesc("AI-Powered central resource endpoint for real-time dispatch and legal compliance monitoring.");
    setFormCategory(activeCategory !== "all" ? activeCategory : "operations");
    setFormTags(`AI-Generated, Live, ${today.replace(/[^a-zA-Z0-9]/g, "")}`);
    setFormUrl("https://mubuslink.com/ai/portal");
    setFormDirSource("Internal Directory");
    setFormNotes(`Auto-generated via AI Tools on ${today}`);
  };

  // Add Link Modal open
  const openAdd = (catDefault?: string) => {
    setFormTitle("");
    setFormDesc("");
    setFormCategory(catDefault || (activeCategory !== "all" ? activeCategory : "operations"));
    setFormTags("");
    setFormUrl("");
    setFormDirSource("Internal Directory");
    setFormNotes("");
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  // Edit Link Modal open
  const openEdit = (link: BusinessLink) => {
    setFormTitle(link.title);
    setFormDesc(link.description);
    setFormCategory(link.category);
    setFormTags(link.tags.join(", "));
    setFormUrl(link.url);
    setFormDirSource(link.directorySource || "Internal Directory");
    setFormNotes(link.notes || "");
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
      url: formUrl,
      directorySource: formDirSource,
      notes: formNotes,
      clicks: 0
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
      directorySource: formDirSource,
      notes: formNotes,
      lastUpdated: new Date().toISOString(),
      clicks: selectedLink?.clicks || 0
    });
    setIsEditModalOpen(false);
  };

  // Admin Managers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const catId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newCat: CategorySchema = {
      id: catId,
      name: newCatName,
      description: newCatDesc || "Custom business operations directory category.",
      icon: "Layers",
      route: `/business-links/${catId}`
    };
    setCategories([...categories, newCat]);
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName) return;
    setTagsList([...tagsList, { id: `tag-${Date.now()}`, name: newTagName }]);
    setNewTagName("");
  };

  const handleDeleteTag = (id: string) => {
    setTagsList(tagsList.filter(t => t.id !== id));
  };

  const handleAddDirSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirName || !newDirHome) return;
    setDirectorySources([...directorySources, {
      id: `dir-${Date.now()}`,
      name: newDirName,
      homepage: newDirHome
    }]);
    setNewDirName("");
    setNewDirHome("");
  };

  const handleDeleteDirSource = (id: string) => {
    setDirectorySources(directorySources.filter(d => d.id !== id));
  };

  // Export JSON
  const handleExportLinks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mubuslink_business_directory_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6" id="general-business-links-module">
      {/* MODULE HEADER & INTERNAL ROUTES NAVIGATION BAR */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-lg">
                Module Specification
              </span>
              <h2 className="text-lg font-black text-white font-display uppercase tracking-wide">
                General Business Links Directory
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Centralized repository for organizing, displaying, and managing business-related resources across operational categories.
            </p>
          </div>

          {/* Quick Route Switcher Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 border border-slate-900 rounded-2xl">
            <button
              onClick={() => handleNavigate("/business-links")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRoute === "/business-links" ? "bg-emerald-600 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Overview Hub
            </button>
            <button
              onClick={() => handleNavigate("/business-links/search")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === "/business-links/search" ? "bg-emerald-600 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Search size={12} />
              <span>Search & Filter</span>
            </button>
            <button
              onClick={() => handleNavigate("/business-links/admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRoute === "/business-links/admin" ? "bg-emerald-600 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings size={12} />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Example Internal URLs Bar */}
        <div className="pt-3 border-t border-slate-850/60 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <LinkIcon size={10} className="text-emerald-400" />
            Internal Routes:
          </span>
          {internalRoutesList.map((ir, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(ir.path, ir.path.includes("operations") ? "operations" : ir.path.includes("marketing") ? "marketing" : undefined)}
              className="px-2 py-0.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-900 rounded text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>{`https://app.ai.studio${ir.path}`}</span>
              <ArrowRight size={8} className="text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: OVERVIEW HUB (/business-links) */}
      {currentRoute === "/business-links" && (
        <div className="space-y-8 animate-fade-in">
          {/* CATEGORIES GRID (Component: CategoryCard) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider font-display flex items-center gap-2">
                <Layers size={14} className="text-emerald-400" />
                <span>Operational Categories ({categories.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Select a category to explore links</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const catLinkCount = links.filter(l => l.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleNavigate(`/business-links/${cat.id}`, cat.id)}
                    className="bg-slate-900/30 border border-slate-900 hover:border-emerald-500/40 p-5 rounded-2xl hover:bg-slate-900/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl group-hover:scale-105 transition-transform">
                          {getCategoryIcon(cat.icon)}
                        </div>
                        <span className="px-2 py-0.5 bg-slate-950 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold rounded-lg">
                          {catLinkCount} Link{catLinkCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-1">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2 mb-4">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-850/60 pt-3">
                      <span>{cat.route}</span>
                      <ArrowRight size={12} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT / FEATURED LINKS SECTION */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider font-display flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>Featured Business Directories & Sample Links</span>
              </h3>
              <button
                onClick={() => handleNavigate("/business-links/search")}
                className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>View All ({links.length})</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.slice(0, 6).map((link) => (
                <div
                  key={link.id}
                  className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {getCategoryName(link.category)}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                        {link.directorySource}
                      </span>
                    </div>

                    <h4 
                      onClick={() => setSelectedLinkId(link.id)}
                      className="text-sm font-bold text-slate-100 mb-1 hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {link.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-900/60 mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {link.tags.map((t, ti) => (
                        <span key={ti} className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <button
                        onClick={() => setSelectedLinkId(link.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Eye size={10} />
                        <span>View Details</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold group-hover:underline"
                      >
                        <span>Visit Site</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CATEGORY OVERVIEW PAGE (/business-links/:category) */}
      {currentRoute.startsWith("/business-links/") && currentRoute !== "/business-links/search" && currentRoute !== "/business-links/admin" && (
        <div className="space-y-6 animate-fade-in">
          {/* CATEGORY HEADER */}
          {(() => {
            const currentCatObj = categories.find(c => c.id === filterCategory) || categories[0];
            const catLinks = links.filter(l => filterCategory === "all" || l.category === filterCategory);
            return (
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                      {getCategoryIcon(currentCatObj?.icon || "Layers")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white font-display">
                          {currentCatObj?.name || "Category Overview"}
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold rounded-lg">
                          {catLinks.length} Links
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        {currentCatObj?.description}
                      </p>
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openAdd(currentCatObj.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Link</span>
                    </button>
                    <button
                      onClick={handleExportLinks}
                      className="px-3.5 py-2 bg-slate-950 border border-slate-850 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export Links</span>
                    </button>
                  </div>
                </div>

                {/* Category Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-850/60 scrollbar-none">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleNavigate(`/business-links/${c.id}`, c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                        filterCategory === c.id
                          ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-400"
                          : "border-slate-900 bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* LIST OF LINK CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.filter(l => filterCategory === "all" || l.category === filterCategory).map((link) => (
              <div
                key={link.id}
                className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-950 text-slate-400 border border-slate-900">
                      Source: {link.directorySource}
                    </span>

                    {userRole !== "Viewer" && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(link)}
                          className="p-1 text-slate-500 hover:text-white rounded transition-colors"
                          title="Edit link"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteLink(link.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="Delete link"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 
                    onClick={() => setSelectedLinkId(link.id)}
                    className="text-sm font-bold text-slate-100 mb-1.5 hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    {link.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal mb-4">
                    {link.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-900/60 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {link.tags.map((t, ti) => (
                      <span key={ti} className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <button
                      onClick={() => setSelectedLinkId(link.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Eye size={10} />
                      <span>Inspect Details</span>
                    </button>

                    <a
                      href={link.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold group-hover:underline"
                    >
                      <span>Open Link</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SEARCH & FILTER PAGE (/business-links/search) */}
      {currentRoute === "/business-links/search" && (
        <div className="space-y-6 animate-fade-in">
          {/* SEARCH BAR & FILTERS PANEL (Component: SearchBar) */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-emerald-400" />
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">
                Search & Filter Directory
              </h3>
            </div>

            {/* Input search */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-2xl w-full">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search by title, description, directory source, or keywords..."
                className="bg-transparent text-xs text-slate-100 outline-none w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Category Filter */}
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Category Filter
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Tag Filter
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  value={filterTag}
                  onChange={(e) => {
                    setFilterTag(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Tags</option>
                  {tagsList.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Directory Source Filter */}
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Directory Source
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  value={filterDirectorySource}
                  onChange={(e) => {
                    setFilterDirectorySource(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Directory Sources</option>
                  {directorySources.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Sort By
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recently-updated">Recently Updated</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                  <option value="most-clicked">Most Clicked</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEARCH RESULTS COUNT */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Showing {paginatedLinks.length} of {filteredAndSortedLinks.length} matched links</span>
            <span className="text-[10px] text-slate-500">Page {currentPage} of {totalPages}</span>
          </div>

          {/* RESULTS GRID */}
          {paginatedLinks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/15 rounded-3xl border border-slate-900 border-dashed">
              <Globe size={32} className="text-slate-600 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-slate-400">No Matched Business Links</h4>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">Try resetting filters or expanding your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {getCategoryName(link.category)}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                        {link.directorySource}
                      </span>
                    </div>

                    <h4 
                      onClick={() => setSelectedLinkId(link.id)}
                      className="text-sm font-bold text-slate-100 mb-1 hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal line-clamp-2 mb-4">
                      {link.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-900/60 mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {link.tags.map((t, ti) => (
                        <span key={ti} className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <button
                        onClick={() => setSelectedLinkId(link.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Eye size={10} />
                        <span>View Card</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold group-hover:underline"
                      >
                        <span>Launch URL</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                    currentPage === page ? "bg-emerald-600 text-slate-950" : "bg-slate-950 border border-slate-850 text-slate-400"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: ADMIN PAGE (/business-links/admin) */}
      {currentRoute === "/business-links/admin" && (
        <div className="space-y-6 animate-fade-in">
          {/* PERMISSIONS SWITCHER HEADER */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-amber-400" />
                  <h3 className="text-sm font-black uppercase text-slate-100 font-display">
                    Directory Admin Panel
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Manage categories, directory sources, tags, bulk import/export, and administrative role permissions.
                </p>
              </div>

              {/* Role selector */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 border border-slate-850 rounded-2xl shrink-0">
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2">Role:</span>
                {(["Admin", "Manager", "Viewer"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRole(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      userRole === r ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {userRole === "Viewer" ? (
            <div className="p-8 bg-slate-900/20 border border-slate-900 rounded-3xl text-center space-y-3">
              <Shield size={28} className="text-amber-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Viewer Permission Active</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You are currently in Viewer mode. Switch to Admin or Manager role above to modify categories, tags, or directory sources.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CATEGORY MANAGER */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h4 className="text-xs font-black uppercase text-slate-100 font-display flex items-center gap-2">
                    <Layers size={14} className="text-emerald-400" />
                    <span>Category Manager</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">{categories.length} total</span>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      New Category Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Legal Compliance"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-100 outline-none"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief overview of links in this category..."
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-100 outline-none"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Add Category
                  </button>
                </form>

                <div className="space-y-2 pt-2 border-t border-slate-850 max-h-60 overflow-y-auto">
                  {categories.map(c => (
                    <div key={c.id} className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{c.name}</div>
                        <div className="text-[9px] font-mono text-slate-500">{c.route}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Delete category"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIRECTORY SOURCE MANAGER */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h4 className="text-xs font-black uppercase text-slate-100 font-display flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    <span>Directory Sources</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">{directorySources.length} total</span>
                </div>

                <form onSubmit={handleAddDirSource} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Directory Source Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Trustpilot"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-100 outline-none"
                      value={newDirName}
                      onChange={(e) => setNewDirName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Homepage URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.trustpilot.com"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-100 outline-none"
                      value={newDirHome}
                      onChange={(e) => setNewDirHome(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-550 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Add Source
                  </button>
                </form>

                <div className="space-y-2 pt-2 border-t border-slate-850 max-h-60 overflow-y-auto">
                  {directorySources.map(d => (
                    <div key={d.id} className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{d.name}</div>
                        <a href={d.homepage} target="_blank" className="text-[9px] font-mono text-blue-400 hover:underline">{d.homepage}</a>
                      </div>
                      <button
                        onClick={() => handleDeleteDirSource(d.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TAG MANAGER & BULK UTILITIES */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h4 className="text-xs font-black uppercase text-slate-100 font-display flex items-center gap-2">
                      <TagIcon size={14} className="text-purple-400" />
                      <span>Tag Manager</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">{tagsList.length} tags</span>
                  </div>

                  <form onSubmit={handleAddTag} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="New tag..."
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-550 text-white font-bold rounded-xl text-xs"
                    >
                      Add
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pt-1">
                    {tagsList.map(t => (
                      <span key={t.id} className="px-2 py-1 bg-slate-950 border border-slate-850 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1.5">
                        <span>#{t.name}</span>
                        <button onClick={() => handleDeleteTag(t.id)} className="text-slate-500 hover:text-rose-400">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bulk Import / Export Section */}
                <div className="pt-4 border-t border-slate-850 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-200 font-display">
                    Bulk Import & Export
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleExportLinks}
                      className="p-2.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/40 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download size={13} className="text-emerald-400" />
                      <span>Export Directory</span>
                    </button>
                    <label className="p-2.5 bg-slate-950 border border-slate-850 hover:border-emerald-500/40 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                      <Upload size={13} className="text-indigo-400" />
                      <span>Import JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            try {
                              const imported = JSON.parse(evt.target?.result as string);
                              if (Array.isArray(imported)) {
                                imported.forEach((item: any) => {
                                  if (item.title && item.url) {
                                    onAddLink({
                                      title: item.title,
                                      description: item.description || "",
                                      category: item.category || "operations",
                                      tags: item.tags || [],
                                      url: item.url,
                                      directorySource: item.directorySource || "Imported",
                                      notes: item.notes || ""
                                    });
                                  }
                                });
                                alert(`Successfully imported ${imported.length} links!`);
                              }
                            } catch (err) {
                              alert("Invalid JSON import file format.");
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL (/business-links/:category/:linkId) */}
      {selectedLink && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  {getCategoryName(selectedLink.category)}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedLink.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLinkId(null)}
                className="text-slate-500 hover:text-white"
              >
                <Plus size={18} className="transform rotate-45" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <strong className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Description</strong>
                <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                  {selectedLink.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-500 text-[9px] block uppercase">Directory Source</span>
                  <span className="text-emerald-400 font-bold">{selectedLink.directorySource}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <span className="text-slate-500 text-[9px] block uppercase">Last Updated</span>
                  <span className="text-slate-300">{new Date(selectedLink.lastUpdated).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <strong className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Resource URL</strong>
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-300 font-mono text-xs truncate flex-1">{selectedLink.url}</span>
                  <button
                    onClick={() => handleCopy(selectedLink.url)}
                    className="p-1.5 text-slate-400 hover:text-emerald-300 bg-slate-900 rounded"
                    title="Copy URL"
                  >
                    {copiedUrl === selectedLink.url ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {selectedLink.notes && (
                <div>
                  <strong className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Internal Operational Notes</strong>
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl text-amber-200 text-xs">
                    {selectedLink.notes}
                  </div>
                </div>
              )}

              <div>
                <strong className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Associated Tags</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLink.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const l = selectedLink;
                    setSelectedLinkId(null);
                    openEdit(l);
                  }}
                  className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Edit size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDeleteLink(selectedLink.id);
                    setSelectedLinkId(null);
                  }}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>

              <a
                href={selectedLink.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <span>Launch Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADD LINK MODAL */}
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
              {/* AI Tools Auto-Fill Banner Button */}
              <button
                type="button"
                onClick={handleAIAutoFillLink}
                className="w-full py-2 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-indigo-500/30 border border-emerald-500/30 text-emerald-300 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                <span>AI Auto-Fill Link Specs ({new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})</span>
              </button>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Yelp Business Page"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summarize resource purpose..."
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Directory Source</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formDirSource}
                    onChange={(e) => setFormDirSource(e.target.value)}
                  >
                    {directorySources.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tags (Comma Sep)</label>
                <input
                  type="text"
                  placeholder="e.g., Local, Reviews, Reputation"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Operational Notes</label>
                <input
                  type="text"
                  placeholder="e.g., Reviewed weekly by support lead..."
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl uppercase font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-slate-950 rounded-xl uppercase font-bold text-[10px] cursor-pointer"
                >
                  Save Business Link ({new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LINK MODAL */}
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
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Directory Source</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={formDirSource}
                    onChange={(e) => setFormDirSource(e.target.value)}
                  >
                    {directorySources.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tags (Comma Sep)</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Resource URL</label>
                <input
                  type="url"
                  required
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Operational Notes</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl uppercase font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-550 text-slate-950 rounded-xl uppercase font-bold text-[10px]"
                >
                  Update Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
