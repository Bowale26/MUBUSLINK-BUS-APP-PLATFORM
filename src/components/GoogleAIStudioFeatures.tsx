import React, { useState } from "react";
import {
  Sparkles,
  Code2,
  FileCode,
  Image as ImageIcon,
  Video,
  Music,
  FileSpreadsheet,
  FolderKanban,
  FileText,
  Key,
  Github,
  Cloud,
  ExternalLink,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Layers,
  Terminal,
  Copy,
  Check,
  Cpu,
  ArrowUpRight,
  Globe,
  Sliders,
  DollarSign
} from "lucide-react";

interface GoogleAIStudioFeaturesProps {
  onTriggerLog?: (msg: string, type: "info" | "success" | "warning") => void;
  onNavigateTab?: (tab: string) => void;
}

export default function GoogleAIStudioFeatures({ onTriggerLog, onNavigateTab }: GoogleAIStudioFeaturesProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "prototyping" | "multimodal" | "workspace" | "export" | "apikeys" | "pricing">("overview");
  
  // Interactive Prototyping Simulator State
  const [prototypePrompt, setPrototypePrompt] = useState("Build a real-time transit telemetry dashboard with driver dispatch map");
  const [isSimulatingBuild, setIsSimulatingBuild] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  // API Key Generator Simulator State
  const [generatedKeys, setGeneratedKeys] = useState<{ name: string; key: string; created: string; tier: string }[]>([
    { name: "Production Applet Key", key: "AIzaSyB8xQ9_VibeStudio_Prod_77301", created: "2026-07-20", tier: "Paid (Pay-as-you-go)" },
    { name: "Development Sandbox Key", key: "AIzaSyD2xL1_VibeStudio_Dev_10283", created: "2026-07-15", tier: "Free Tier" }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedTier, setSelectedTier] = useState<"free" | "paid">("paid");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Multimodal Generation Simulator State
  const [multimodalType, setMultimodalType] = useState<"image" | "video" | "audio">("image");
  const [selectedModel, setSelectedModel] = useState("Imagen 4");
  const [multimodalPrompt, setMultimodalPrompt] = useState("Ultra-detailed futuristic transit station hub at sunset with neon lighting");
  const [isGeneratingMultimodal, setIsGeneratingMultimodal] = useState(false);
  const [multimodalOutput, setMultimodalOutput] = useState<string | null>(null);

  // Code Export Simulator
  const [exportPlatform, setExportPlatform] = useState<"github" | "netlify" | "google-cloud">("github");
  const [isExporting, setIsExporting] = useState(false);

  // Reference URL from prompt
  const referenceUrl = "https://www.websitebuilderexpert.com/vibe-coding/google-ai-studio/";

  const handleSimulateBuild = () => {
    if (!prototypePrompt.trim()) return;
    setIsSimulatingBuild(true);
    setBuildLogs([]);

    const steps = [
      "Analyzing natural language prompt...",
      "Generating React 18 + Tailwind CSS architecture...",
      "Synthesizing state management & component hierarchy...",
      "Wiring API proxy routes & Gemini 3.6 Flash endpoints...",
      "Running lint_applet and compile_applet checks...",
      "Build succeeded! Application ready in preview frame."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setBuildLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (idx === steps.length - 1) {
          setIsSimulatingBuild(false);
          if (onTriggerLog) {
            onTriggerLog(`App prototyping completed for prompt: "${prototypePrompt.slice(0, 30)}..."`, "success");
          }
        }
      }, (idx + 1) * 400);
    });
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const randStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newKey = {
      name: newKeyName,
      key: `AIzaSy${randStr}_StudioKey_${Date.now().toString().slice(-4)}`,
      created: new Date().toISOString().split("T")[0],
      tier: selectedTier === "paid" ? "Paid (Pay-as-you-go)" : "Free Tier"
    };
    setGeneratedKeys(prev => [newKey, ...prev]);
    setNewKeyName("");
    if (onTriggerLog) {
      onTriggerLog(`Created new Google AI Studio API Key: ${newKey.name}`, "success");
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleMultimodalGenerate = () => {
    setIsGeneratingMultimodal(true);
    setMultimodalOutput(null);

    setTimeout(() => {
      setIsGeneratingMultimodal(false);
      setMultimodalOutput(`[Google AI Studio ${selectedModel}]
Generated ${multimodalType.toUpperCase()} artifact for: "${multimodalPrompt}"
Engine: ${selectedModel}
Resolution / Format: ${multimodalType === "video" ? "1080p 60fps Veo Video Stream" : multimodalType === "audio" ? "24kHz Stereo Lossless Audio" : "4K Ultra HD Imagen Render"}
Status: Render Complete (0.8s)`);
      if (onTriggerLog) {
        onTriggerLog(`Generated ${multimodalType} with ${selectedModel}`, "success");
      }
    }, 1000);
  };

  const handleExportCode = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (onTriggerLog) {
        onTriggerLog(`Exported application code to ${exportPlatform.toUpperCase()} repository bundle!`, "success");
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#26e6a6]/20 text-[#26e6a6] border border-[#26e6a6]/30 text-[10px] font-mono font-bold uppercase rounded-md tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse" />
                Google AI Studio Core Capabilities
              </span>
              <span className="text-[10px] text-slate-400 font-mono">vibe-coding environment</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              Google AI Studio Business Workspace
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              A free, browser-based workspace for prototyping full applications with natural language prompts, multimodal media engines (Imagen 4, Veo 3.1, Nano Banana), Google Workspace document integrations, and 1-click code export.
            </p>
          </div>

          <a
            href={referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 shrink-0 w-fit cursor-pointer"
          >
            <span>Learn on Website Builder Expert</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-800">
        {[
          { id: "overview", label: "Suite Overview", icon: Layers },
          { id: "prototyping", label: "App Prototyping", icon: Code2 },
          { id: "multimodal", label: "Multimodal Studio", icon: ImageIcon },
          { id: "workspace", label: "Workspace Integration", icon: FileSpreadsheet },
          { id: "export", label: "Code Export", icon: Github },
          { id: "apikeys", label: "API Key Hub", icon: Key },
          { id: "pricing", label: "Free vs Paid Tier", icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#12332a] text-[#26e6a6] border-[#26e6a6]/40 font-bold shadow-md"
                  : "bg-slate-950/60 text-slate-400 border-slate-850 hover:text-white hover:border-slate-700"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#26e6a6]" : "text-slate-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: App & Website Prototyping */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-500/10 text-[#26e6a6] rounded-xl w-fit group-hover:scale-110 transition-transform">
                <Code2 size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#26e6a6] transition-colors">
                App & Website Prototyping
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build full applications with natural language prompts — no coding required. Automatically generates React, HTML, CSS, and server routes instantly in an iframe preview.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("prototyping")}
              className="mt-4 text-xs font-bold text-[#26e6a6] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>Test Prototyping Engine</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Card 2: Multimodal Content Creation */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Multimodal Content Creation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-definition images (Imagen 4 / Nano Banana), videos (Veo 3.1), and synthetic audio narration in one unified workspace.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("multimodal")}
              className="mt-4 text-xs font-bold text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>Explore Multimodal Studio</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Card 3: Google Workspace Integration */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Google Workspace Integration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build live analytics dashboards directly on top of Google Sheets data, organize Drive files automatically, and query existing documents.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("workspace")}
              className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>View Workspace Pipeline</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Card 4: Code Export */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <Github size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Code Export & Deployment
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export clean production-ready code directly to deploy on GitHub repositories, Netlify hosting, or Google Cloud Run server containers.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("export")}
              className="mt-4 text-xs font-bold text-blue-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>Configure Export Target</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Card 5: API Key Management */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                <Key size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                API Key Management
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create and manage Gemini API keys with granular scopes, environment variable integration, and production deployment rate limit monitoring.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("apikeys")}
              className="mt-4 text-xs font-bold text-purple-400 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>Manage API Keys</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Card 6: Free Tier vs Paid Tier */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-500/10 text-[#26e6a6] rounded-xl w-fit group-hover:scale-110 transition-transform">
                <DollarSign size={20} />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#26e6a6] transition-colors">
                Free vs Paid Tier (Pay-as-you-go)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Free Tier is ideal for prototyping and internal tools. Paid Tier adds full data privacy guarantees and access to flagship models (Imagen 4, Veo 3.1).
              </p>
            </div>
            <button
              onClick={() => setActiveTab("pricing")}
              className="mt-4 text-xs font-bold text-[#26e6a6] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              <span>Compare Plan Tiers</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* 2. APP & WEBSITE PROTOTYPING TAB */}
      {activeTab === "prototyping" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 size={18} className="text-[#26e6a6]" />
                <span>App & Website Prototyping Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                Build complete web applications, interactive dashboards, and business tools using plain natural language prompts without writing manual code.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-[#26e6a6] text-[10px] font-mono font-bold rounded-lg border border-emerald-500/30">
              Zero-Code Prompting
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200">
              Natural Language Application Prompt
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#26e6a6]"
                value={prototypePrompt}
                onChange={(e) => setPrototypePrompt(e.target.value)}
                placeholder="Describe your desired web application or workflow tool..."
              />
              <button
                onClick={handleSimulateBuild}
                disabled={isSimulatingBuild || !prototypePrompt.trim()}
                className="px-5 py-3 bg-[#26e6a6] hover:bg-[#20d095] text-[#08140f] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isSimulatingBuild ? <Zap size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isSimulatingBuild ? "Synthesizing App..." : "Build Prototype"}</span>
              </button>
            </div>
          </div>

          {/* BUILD LOGS DISPLAY */}
          {buildLogs.length > 0 && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-slate-300 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#26e6a6] tracking-wider mb-2 flex items-center gap-2">
                <Terminal size={12} />
                <span>Google AI Studio Build Execution Stream</span>
              </div>
              {buildLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300 animate-fade-in">
                  <CheckCircle2 size={12} className="text-[#26e6a6] shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* FEATURE HIGHLIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl">
              <div className="text-xs font-bold text-white mb-1">Instant Live Preview</div>
              <div className="text-xs text-slate-400">Renders changes live inside an isolated sandbox iframe with hot state updates.</div>
            </div>
            <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl">
              <div className="text-xs font-bold text-white mb-1">Full-Stack Capability</div>
              <div className="text-xs text-slate-400">Generates server-side `/api/*` proxies for Gemini model execution securely.</div>
            </div>
            <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl">
              <div className="text-xs font-bold text-white mb-1">Tailwind & React Standard</div>
              <div className="text-xs text-slate-400">Uses modern React 18, Vite, Lucide icons, and Tailwind utility classes.</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTIMODAL CONTENT CREATION TAB */}
      {activeTab === "multimodal" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-400" />
                <span>Multimodal Content Studio</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate images (Imagen 4 / Nano Banana), high-fidelity videos (Veo 3.1), and synthesized audio narration in one unified environment.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold rounded-lg border border-indigo-500/30">
              Imagen 4 & Veo 3.1 Active
            </span>
          </div>

          {/* MEDIA TYPE SELECTOR */}
          <div className="flex items-center gap-3">
            {[
              { type: "image", label: "Image Generation (Imagen 4 / Nano Banana)", model: "Imagen 4", icon: ImageIcon },
              { type: "video", label: "Video Generation (Veo 3.1)", model: "Veo 3.1", icon: Video },
              { type: "audio", label: "Audio Synthesis & TTS", model: "Gemini Audio", icon: Music }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = multimodalType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setMultimodalType(item.type as any);
                    setSelectedModel(item.model);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/50 shadow-md"
                      : "bg-slate-950 text-slate-400 border-slate-850 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200">
              Prompt for {selectedModel}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
                value={multimodalPrompt}
                onChange={(e) => setMultimodalPrompt(e.target.value)}
                placeholder={`Describe what to render with ${selectedModel}...`}
              />
              <button
                onClick={handleMultimodalGenerate}
                disabled={isGeneratingMultimodal || !multimodalPrompt.trim()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isGeneratingMultimodal ? <Zap size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>Generate Media</span>
              </button>
            </div>
          </div>

          {/* GENERATED OUTPUT */}
          {multimodalOutput && (
            <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl font-mono text-[11px] text-indigo-300 space-y-2 animate-fade-in">
              <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Output Artifact Telemetry</div>
              <pre className="whitespace-pre-wrap">{multimodalOutput}</pre>
            </div>
          )}
        </div>
      )}

      {/* 4. GOOGLE WORKSPACE INTEGRATION TAB */}
      {activeTab === "workspace" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-amber-400" />
                <span>Google Workspace Data Integration</span>
              </h3>
              <p className="text-xs text-slate-400">
                Connect Google Sheets data feeds, automatically query Drive document repositories, and build dashboards on top of live enterprise spreadsheets.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold rounded-lg border border-amber-500/30">
              Workspace Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sheets */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <FileSpreadsheet size={18} />
                <span>Google Sheets Dashboards</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect real-time transit schedules, financial ledgers, or fleet maintenance logs directly from Google Sheets.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                Status: Google Sheets API Connected
              </div>
            </div>

            {/* Drive */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <FolderKanban size={18} />
                <span>Google Drive Organization</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize PDF contracts, dispatch manifests, and operator manuals automatically into structured folders.
              </p>
              <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 p-2 rounded-lg border border-blue-500/20">
                Status: Drive Folder Listener Active
              </div>
            </div>

            {/* Docs */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <FileText size={18} />
                <span>Google Docs RAG Context</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pass existing business policies, route guidelines, and operator handbooks to Gemini as ground truth context.
              </p>
              <div className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                Status: Document Indexer Ready
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CODE EXPORT TAB */}
      {activeTab === "export" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Github size={18} className="text-blue-400" />
                <span>Code Export & Deployment Pipelines</span>
              </h3>
              <p className="text-xs text-slate-400">
                Export full working source code to GitHub, trigger Netlify continuous builds, or deploy directly onto Google Cloud Run.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold rounded-lg border border-blue-500/30">
              1-Click Deployment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "github", title: "GitHub Export", desc: "Push repository directly to your personal or organization GitHub account with GitHub Actions CI/CD.", icon: Github },
              { id: "netlify", title: "Netlify Hosting", desc: "Publish static single-page apps or edge function endpoints instantly on Netlify domains.", icon: Globe },
              { id: "google-cloud", title: "Google Cloud Run", desc: "Deploy full-stack Dockerized container apps on Google Cloud Run with autoscaling capabilities.", icon: Cloud }
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = exportPlatform === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setExportPlatform(p.id as any)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-950/60 border-blue-500 text-white shadow-lg"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-bold text-xs mb-2 text-white">
                    <Icon size={18} className="text-blue-400" />
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Export Target Selected: {exportPlatform.toUpperCase()}</div>
              <div className="text-xs text-slate-400">Includes package.json, server.ts, Vite setup, and environment declarations.</div>
            </div>
            <button
              onClick={handleExportCode}
              disabled={isExporting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              {isExporting ? <Zap size={14} className="animate-spin" /> : <FileCode size={14} />}
              <span>{isExporting ? "Bundling Code..." : `Export to ${exportPlatform.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. API KEY MANAGEMENT TAB */}
      {activeTab === "apikeys" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key size={18} className="text-purple-400" />
                <span>API Key Management Hub</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate and provision Gemini API keys for production app deployment, server routes, and client proxies.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold rounded-lg border border-purple-500/30">
              GEMINI_API_KEY
            </span>
          </div>

          {/* CREATE NEW KEY FORM */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-white">Provision New AI Studio Key</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Key Identifier / Applet Name (e.g., MubusLink Dispatch Bot)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <select
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
              >
                <option value="paid">Paid Tier (Pay-as-you-go)</option>
                <option value="free">Free Tier (Prototyping)</option>
              </select>
              <button
                onClick={handleGenerateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Key size={14} />
                <span>Create Key</span>
              </button>
            </div>
          </div>

          {/* KEYS LIST */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">Active API Keys</div>
            {generatedKeys.map((k, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{k.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-900 text-purple-300 rounded border border-purple-500/30">
                      {k.tier}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">{k.key}</div>
                </div>

                <button
                  onClick={() => handleCopyKey(k.key)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedKey === k.key ? <Check size={12} className="text-[#26e6a6]" /> : <Copy size={12} />}
                  <span>{copiedKey === k.key ? "Copied" : "Copy"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. FREE vs PAID TIER TAB */}
      {activeTab === "pricing" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign size={18} className="text-[#26e6a6]" />
                <span>Free Tier vs Paid Tier (Pay-as-you-go)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose the right tier for your enterprise prototyping and production needs.
              </p>
            </div>
            <a
              href={referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#26e6a6] hover:underline flex items-center gap-1"
            >
              <span>Read Full Breakdown</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FREE TIER */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Free Tier</h4>
                  <div className="text-xs text-slate-400">Ideal for prototyping & internal tools</div>
                </div>
                <span className="text-lg font-black text-[#26e6a6]">$0 / mo</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Browser-based applet building & instant preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Standard rate limits for Gemini 2.5/3 Flash</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>GitHub and Netlify code export capabilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Google Workspace documents integration</span>
                </div>
              </div>
            </div>

            {/* PAID TIER */}
            <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-4 relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#26e6a6] text-[#08140f] text-[9px] font-mono font-bold uppercase rounded-full">
                Recommended for Production
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Paid Tier (Pay-as-you-go)</h4>
                  <div className="text-xs text-slate-400">Enterprise data privacy & flagship models</div>
                </div>
                <span className="text-lg font-black text-emerald-400">Pay-as-you-go</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#26e6a6] shrink-0" />
                  <span className="font-bold text-white">Enterprise Data Privacy & Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Access to flagship image model: <strong className="text-white">Imagen 4</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Access to flagship video model: <strong className="text-white">Veo 3.1</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#26e6a6] shrink-0" />
                  <span>Higher request throughput & custom SLA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
