import React, { useState } from "react";
import { 
  Sparkles, 
  LayoutGrid, 
  Globe, 
  Layers, 
  Cpu, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Megaphone, 
  Search, 
  Type, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  Play, 
  Copy, 
  Zap, 
  Terminal,
  ChevronRight,
  Sliders,
  Bookmark
} from "lucide-react";

export interface NovaModule {
  id: string;
  label: string;
  icon: React.ReactNode;
  eyebrow: string;
  tagline: string;
  features: [string, string][];
}

export default function NovaCreativeSuite({ onTriggerLog }: { onTriggerLog?: (msg: string, type: "info" | "success" | "warning" | "error") => void }) {
  const [activeModuleId, setActiveModuleId] = useState<string>("dashboard");
  const [activeTab, setActiveTab] = useState<"features" | "interactive-sandbox">("features");
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOutput, setGenerationOutput] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // 10 Modules definition matching prompt
  const modules: NovaModule[] = [
    {
      id: "dashboard",
      label: "Dashboard Hub",
      icon: <LayoutGrid size={17} />,
      eyebrow: "Overview",
      tagline: "Your account at a glance: active projects, usage, recent renders, and where to pick back up.",
      features: [
        ["Project timeline", "See every website, video, image set, and campaign in one running feed, newest first."],
        ["Usage & credits", "Track render minutes, image generations, and word counts against your plan in real time."],
        ["Quick resume", "Jump back into the last file you touched in any module with one click."],
        ["Team activity", "See what collaborators changed, published, or commented on across the workspace."]
      ]
    },
    {
      id: "website",
      label: "Website Builder",
      icon: <Globe size={17} />,
      eyebrow: "Build",
      tagline: "Describe the site you want and get a working, editable page — then drag, tweak, and publish.",
      features: [
        ["Prompt-to-site", "Turn a plain description into a structured multi-page layout in under a minute."],
        ["Visual editor", "Adjust spacing, color, and copy directly on the canvas without touching code."],
        ["Responsive preview", "Check how every page looks on desktop, tablet, and phone before you publish."],
        ["One-click hosting", "Push live to a free subdomain or connect your own domain."]
      ]
    },
    {
      id: "templates",
      label: "Templates Engine",
      icon: <Layers size={17} />,
      eyebrow: "Library",
      tagline: "A searchable library of layouts, decks, and documents you can clone and make your own.",
      features: [
        ["Category browser", "Filter by industry, format, or goal — landing page, pitch deck, invoice, resume."],
        ["Smart cloning", "Duplicate a template with your brand colors and logo applied automatically."],
        ["Save your own", "Turn any finished project into a reusable template for your team."],
        ["Version history", "Roll back to an earlier draft of any template at any time."]
      ]
    },
    {
      id: "superlab",
      label: "AI SuperLab",
      icon: <Cpu size={17} />,
      eyebrow: "Experiment",
      tagline: "A sandbox for chaining models and tools together to build custom automations.",
      features: [
        ["Flow canvas", "Wire text, image, and audio models together into a repeatable pipeline."],
        ["Prompt versioning", "Compare outputs across prompt revisions side by side."],
        ["Custom presets", "Save a tuned combination of model, temperature, and style as a reusable preset."],
        ["Batch runs", "Run one flow across hundreds of inputs and export results as a sheet."]
      ]
    },
    {
      id: "image",
      label: "Image Studio",
      icon: <ImageIcon size={17} />,
      eyebrow: "Create",
      tagline: "Generate, upscale, and edit images from a prompt, a sketch, or a reference photo.",
      features: [
        ["Text-to-image", "Describe a scene, subject, and style to generate a full set of variations."],
        ["Inpaint & retouch", "Select a region and replace, remove, or extend it without redoing the whole image."],
        ["Style matching", "Upload a reference and apply its palette or texture to new generations."],
        ["Background removal", "Isolate a subject and export it with a transparent background instantly."]
      ]
    },
    {
      id: "audio",
      label: "Audio Symphony",
      icon: <Music size={17} />,
      eyebrow: "Compose",
      tagline: "Write music, voiceover, and sound effects from a text prompt or a hummed melody.",
      features: [
        ["Track generation", "Produce a full instrumental track in a chosen genre, mood, and length."],
        ["Voice synthesis", "Turn a script into natural narration in dozens of languages and voices."],
        ["Stem separation", "Split any track into vocals, drums, bass, and melody for remixing."],
        ["Sound effects", "Generate short foley or ambience clips matched to a scene description."]
      ]
    },
    {
      id: "cinema",
      label: "Neural Cinema",
      icon: <Video size={17} />,
      eyebrow: "Produce",
      tagline: "Turn a script or storyboard into a rendered video, scene by scene.",
      features: [
        ["Text-to-video", "Generate short clips from a scene description, with consistent characters across cuts."],
        ["Storyboard mode", "Lay out shots in sequence and preview pacing before rendering."],
        ["Auto captions", "Generate and style timed captions in your chosen language automatically."],
        ["Scene extension", "Lengthen or reframe an existing clip while keeping motion consistent."]
      ]
    },
    {
      id: "marketing",
      label: "Marketing Engine",
      icon: <Megaphone size={17} />,
      eyebrow: "Promote",
      tagline: "Plan campaigns, generate ad copy, and schedule posts across your channels.",
      features: [
        ["Campaign planner", "Lay out a launch timeline across email, social, and ads on one calendar."],
        ["Ad copy generator", "Produce headline and body variations sized for each platform."],
        ["A/B test tracking", "Compare performance across copy or creative variants automatically."],
        ["Cross-posting", "Schedule one piece of content to publish across multiple channels at once."]
      ]
    },
    {
      id: "seo",
      label: "SEO & Sales Content",
      icon: <Search size={17} />,
      eyebrow: "Convert",
      tagline: "Research keywords and draft landing pages, product copy, and outreach that rank and convert.",
      features: [
        ["Keyword research", "Find search terms your audience uses, ranked by volume and difficulty."],
        ["On-page scoring", "Get a checklist of fixes to improve a page's search readiness."],
        ["Product copywriting", "Generate descriptions, bullet points, and comparison tables from a spec sheet."],
        ["Outreach drafts", "Draft personalized sales and partnership emails from a lead list."]
      ]
    },
    {
      id: "fonts",
      label: "Fonts & Animations",
      icon: <Type size={17} />,
      eyebrow: "Refine",
      tagline: "Pick type pairings and motion presets to give any project a finished, on-brand feel.",
      features: [
        ["Pairing suggestions", "Get display and body font combinations matched to your project's tone."],
        ["Motion presets", "Apply pre-built entrance, hover, and scroll animations without writing keyframes."],
        ["Brand kits", "Save a set of fonts, colors, and motion styles to reuse across every project."],
        ["Live preview", "See type and motion changes applied to your real content, not placeholder text."]
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];

  const handleSimulateGeneration = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGenerationOutput(null);

    setTimeout(() => {
      setIsGenerating(false);
      const res = `[Nova Suite ${currentModule.label} Output]
Generated task for: "${promptInput}"
Status: Completed
Execution Pipeline: Nova Engine v3.8
Timestamp: ${new Date().toLocaleTimeString()}
Result: Applied ${currentModule.eyebrow} pipeline to "${currentModule.label}". Project ready for preview.`;
      setGenerationOutput(res);
      if (onTriggerLog) {
        onTriggerLog(`Nova Suite (${currentModule.label}): Generated output for prompt "${promptInput.slice(0, 30)}..."`, "success");
      }
    }, 1200);
  };

  const handleCopyRoute = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onTriggerLog) {
      onTriggerLog(`Copied Nova route: ${url}`, "info");
    }
  };

  return (
    <div className="bg-[#0a0e14] text-[#e7ecf3] border border-[#1e2530] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[640px]">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full lg:w-[260px] bg-[#0c1017] border-b lg:border-b-0 lg:border-r border-[#1e2530] p-5 flex flex-col gap-1.5 shrink-0">
        {/* BRAND MARK */}
        <div className="flex items-center gap-2.5 px-2 py-2 mb-3">
          <div className="w-5 h-5 bg-[#26e6a6] rounded-md shadow-[0_0_14px_rgba(38,230,166,0.5)] shrink-0" />
          <span className="font-display font-bold text-sm tracking-wide text-white">Nova Suite</span>
          <span className="ml-auto text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#12332a] text-[#26e6a6] rounded border border-[#26e6a6]/30">
            AI CREATIVE
          </span>
        </div>

        <div className="text-[9px] font-mono uppercase tracking-widest text-[#8792a3] px-2 mb-1">
          Creative Modules ({modules.length})
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="space-y-1">
          {modules.map((m, idx) => {
            const isActive = activeModuleId === m.id;
            return (
              <React.Fragment key={m.id}>
                {idx === 1 && <div className="h-[1px] bg-[#1e2530] my-2" />}
                <button
                  onClick={() => {
                    setActiveModuleId(m.id);
                    setGenerationOutput(null);
                    if (onTriggerLog) {
                      onTriggerLog(`Switched to Nova Module: ${m.label}`, "info");
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left outline-none cursor-pointer border ${
                    isActive
                      ? "bg-[#12332a] text-[#26e6a6] border-[#26e6a6]/30 font-semibold shadow-sm"
                      : "bg-transparent text-[#8792a3] border-transparent hover:bg-[#161b26] hover:text-[#e7ecf3]"
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? "text-[#26e6a6]" : "text-[#8792a3]"}`}>
                    {m.icon}
                  </span>
                  <span className="flex-1 truncate">{m.label}</span>
                  {m.id === "website" && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26e6a6] shadow-[0_0_6px_rgba(38,230,166,0.7)]" />
                  )}
                  {isActive && <ChevronRight size={12} className="text-[#26e6a6]" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* MAIN MODULE CONTENT DISPLAY */}
      <div className="flex-1 p-6 lg:p-10 flex flex-col justify-between max-w-4xl">
        <div className="space-y-6">
          
          {/* MODULE HEADER */}
          <div className="space-y-2">
            <div className="font-mono text-[11px] tracking-widest uppercase text-[#26e6a6] font-bold flex items-center gap-2">
              <Sparkles size={13} className="animate-pulse" />
              <span>{currentModule.eyebrow}</span>
            </div>
            
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {currentModule.label}
            </h1>
            
            <p className="text-sm text-[#8792a3] leading-relaxed max-w-xl">
              {currentModule.tagline}
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center gap-2 border-b border-[#1e2530] pb-3">
            <button
              onClick={() => setActiveTab("features")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "features" ? "bg-[#161b26] text-[#26e6a6] border border-[#26e6a6]/30" : "text-[#8792a3] hover:text-white"
              }`}
            >
              Module Features
            </button>
            <button
              onClick={() => setActiveTab("interactive-sandbox")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "interactive-sandbox" ? "bg-[#161b26] text-[#26e6a6] border border-[#26e6a6]/30" : "text-[#8792a3] hover:text-white"
              }`}
            >
              <Zap size={13} className="text-[#26e6a6]" />
              <span>AI Prompt Sandbox</span>
            </button>
          </div>

          {/* FEATURE GRID */}
          {activeTab === "features" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentModule.features.map(([title, desc], fIdx) => (
                <div
                  key={fIdx}
                  className="bg-[#12161f] border border-[#1e2530] hover:border-[#26e6a6]/30 rounded-xl p-4 transition-all group"
                >
                  <div className="text-xs font-bold text-[#e7ecf3] mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26e6a6] shrink-0" />
                    <span className="group-hover:text-[#26e6a6] transition-colors">{title}</span>
                  </div>
                  <div className="text-xs text-[#8792a3] leading-relaxed">
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* INTERACTIVE SANDBOX */
            <div className="bg-[#12161f] border border-[#1e2530] rounded-2xl p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Terminal size={14} className="text-[#26e6a6]" />
                  <span>Execute {currentModule.label} Pipeline</span>
                </label>
                <p className="text-[11px] text-[#8792a3]">
                  Enter a text prompt to simulate model generation and workflow automation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={`Describe your prompt for ${currentModule.label}...`}
                  className="flex-1 bg-[#0a0e14] border border-[#1e2530] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#26e6a6]"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSimulateGeneration()}
                />
                <button
                  onClick={handleSimulateGeneration}
                  disabled={isGenerating || !promptInput.trim()}
                  className="px-4 py-2.5 bg-[#26e6a6] hover:bg-[#20d095] text-[#08140f] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <Zap size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} fill="currentColor" />
                      <span>Run Pipeline</span>
                    </>
                  )}
                </button>
              </div>

              {/* OUTPUT DISPLAY */}
              {generationOutput && (
                <div className="p-3.5 bg-[#0a0e14] border border-[#26e6a6]/30 rounded-xl space-y-1 font-mono text-[11px] text-[#26e6a6] animate-fade-in">
                  <div className="text-[9px] uppercase tracking-wider text-[#8792a3]">Generated Telemetry</div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{generationOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTONS & ROUTE NOTE */}
          <div className="pt-4 border-t border-[#1e2530] space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onTriggerLog) {
                    onTriggerLog(`Launched Nova Module workspace: ${currentModule.label}`, "success");
                  }
                  setActiveTab("interactive-sandbox");
                }}
                className="px-5 py-2.5 bg-[#26e6a6] hover:bg-[#20d095] text-[#08140f] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Open {currentModule.label}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  if (onTriggerLog) {
                    onTriggerLog(`Opening documentation for Nova Module: ${currentModule.label}`, "info");
                  }
                  window.open(`https://app.novasuite.ai/${currentModule.id}`, "_blank");
                }}
                className="px-4 py-2.5 bg-transparent border border-[#1e2530] hover:border-[#4d5566] text-[#8792a3] hover:text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>View documentation</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* ROUTE NOTE DISPLAY */}
            <div className="pt-3 border-t border-[#1e2530] flex items-center justify-between font-mono text-[11px] text-[#4d5566]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[#8792a3]">Route:</span>
                <span className="text-[#8792a3]">app.novasuite.ai/</span>
                <span className="text-[#26e6a6] font-bold">{currentModule.id}</span>
              </div>

              <button
                onClick={() => handleCopyRoute(`https://app.novasuite.ai/${currentModule.id}`)}
                className="text-[#8792a3] hover:text-white transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                title="Copy Nova Module route"
              >
                {copiedLink ? <Check size={11} className="text-[#26e6a6]" /> : <Copy size={11} />}
                <span>{copiedLink ? "Copied!" : "Copy Route"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
