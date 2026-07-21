import { useState, useMemo } from "react";
import { 
  Settings, 
  Trash2, 
  CheckSquare, 
  Square, 
  Key, 
  Database, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Lock,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

interface Project {
  projectId: string;
  businessName: string;
  jurisdictions?: string;
  createdAt?: string;
}

interface AdminSettingsProps {
  projects: Project[];
  onRefreshProjects: () => void;
  onDeleteProjects: (ids: string[]) => Promise<void>;
  onTriggerLog: (msg: string, type: "info" | "success" | "warning") => void;
}

export default function AdminSettings({
  projects,
  onRefreshProjects,
  onDeleteProjects,
  onTriggerLog
}: AdminSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<"projects" | "integrations">("projects");
  
  // Bulk-delete selection state
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // API Config states
  const [apiKeyInput, setApiKeyInput] = useState("••••••••••••••••••••••••••••");
  const [webhookUrl, setWebhookUrl] = useState("https://api.mubuslink.com/v1/telemetry");
  const [isApiKeyRevealed, setIsApiKeyRevealed] = useState(false);

  // Project Checkbox Handlers (Requested in Checkpoint 1, #2)
  const handleToggleSelectAll = () => {
    if (selectedProjectIds.length === projects.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(projects.map(p => p.projectId));
    }
  };

  const handleToggleSelectProject = (projectId: string) => {
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(prev => prev.filter(id => id !== projectId));
    } else {
      setSelectedProjectIds(prev => [...prev, projectId]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjectIds.length === 0) return;
    if (!confirm(`Are you absolutely sure you want to bulk-delete the ${selectedProjectIds.length} selected project(s)?`)) return;

    setIsDeleting(true);
    onTriggerLog(`Bulk deleting ${selectedProjectIds.length} projects from Firestore...`, "info");
    
    try {
      await onDeleteProjects(selectedProjectIds);
      onTriggerLog(`Successfully bulk-deleted ${selectedProjectIds.length} projects.`, "success");
      setSelectedProjectIds([]);
    } catch (err: any) {
      onTriggerLog(`Bulk delete warning: ${err.message}`, "warning");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6" id="admin-settings">
      {/* Settings SubTabs */}
      <div className="flex bg-slate-950/60 p-1 border border-slate-900 rounded-2xl w-fit select-none font-display text-xs">
        <button
          onClick={() => setActiveSubTab("projects")}
          className={`px-4 py-2 rounded-xl font-black transition-all ${
            activeSubTab === "projects" ? "bg-emerald-600 text-slate-950" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Firestore Projects
        </button>
        <button
          onClick={() => setActiveSubTab("integrations")}
          className={`px-4 py-2 rounded-xl font-black transition-all ${
            activeSubTab === "integrations" ? "bg-emerald-600 text-slate-950" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          API Integrations
        </button>
      </div>

      {activeSubTab === "projects" ? (
        <div className="space-y-6">
          {/* Projects Table Wrapper with Multi-Select Bulk Delete (Requested in Checkpoint 1, #2) */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest pl-1">Firestore 'user_projects' Catalog</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Manage persistent project environments saved in the Google Cloud collection.</p>
              </div>

              {/* Bulk operations controller */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={onRefreshProjects}
                  className="p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Refresh Projects list"
                >
                  <RefreshCw size={13} className={isDeleting ? "animate-spin" : ""} />
                </button>
                
                {selectedProjectIds.length > 0 && (
                  <button 
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-550 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md select-none cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Bulk Delete ({selectedProjectIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Projects List with Multi-Select Checkboxes */}
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-slate-900 rounded-2xl border-dashed">
                <Database size={32} className="text-slate-650 mx-auto mb-2.5" />
                <h4 className="text-xs font-bold text-slate-400">No projects stored in Firestore user_projects</h4>
                <p className="text-[10px] text-slate-500 mt-1">Sitemap layouts generated on the promotional tabs will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-900 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-[40px]">
                        <button 
                          onClick={handleToggleSelectAll}
                          className="text-slate-500 hover:text-slate-300 outline-none"
                          title="Select / Deselect All"
                        >
                          {selectedProjectIds.length === projects.length ? (
                            <CheckSquare size={14} className="text-emerald-400" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-2">Project ID / Details</th>
                      <th className="py-3 px-2">Business Name</th>
                      <th className="py-3 px-2">Region Scope</th>
                      <th className="py-3 px-2 text-right">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 font-medium">
                    {projects.map((project) => {
                      const isSelected = selectedProjectIds.includes(project.projectId);
                      return (
                        <tr 
                          key={project.projectId}
                          className={`hover:bg-slate-900/10 transition-colors ${
                            isSelected ? "bg-slate-900/15" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <button 
                              onClick={() => handleToggleSelectProject(project.projectId)}
                              className="text-slate-500 hover:text-slate-300 outline-none"
                            >
                              {isSelected ? (
                                <CheckSquare size={14} className="text-emerald-400" />
                              ) : (
                                <Square size={14} />
                              )}
                            </button>
                          </td>
                          
                          <td className="py-3.5 px-2 select-text font-mono text-[10px] font-bold text-slate-300">
                            {project.projectId}
                          </td>
                          
                          <td className="py-3.5 px-2 select-text text-slate-100 font-bold">
                            {project.businessName}
                          </td>
                          
                          <td className="py-3.5 px-2 select-text text-slate-400">
                            {project.jurisdictions || "Cascadia"}
                          </td>
                          
                          <td className="py-3.5 px-2 text-right text-slate-500 font-mono text-[10px]">
                            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* API Integrations subsection */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys Configuration */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
              <Key size={14} className="text-indigo-400" />
              <h3 className="text-xs font-black uppercase text-slate-100 font-display">Workspace Credentials</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Google Gemini API Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 flex items-center justify-between font-mono text-slate-400">
                    <span>{isApiKeyRevealed ? "AI_STUDIO_LIVE_KEY_LOADED" : apiKeyInput}</span>
                    <button 
                      onClick={() => setIsApiKeyRevealed(!isApiKeyRevealed)}
                      className="text-[10px] text-slate-550 hover:text-white"
                    >
                      {isApiKeyRevealed ? "Hide" : "Reveal"}
                    </button>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 block leading-normal mt-1">Configured in AI Studio Secrets settings. Automatically injected server-side.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Webhook Endpoints</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <span className="text-[9px] text-slate-500 block leading-normal mt-1">Webhook URL for external dispatch triggers.</span>
              </div>
            </div>
          </div>

          {/* System status details */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
                <Activity size={14} className="text-emerald-400" />
                <h3 className="text-xs font-black uppercase text-slate-100 font-display">Central Health handshake</h3>
              </div>

              <div className="space-y-2.5 pt-4 text-xs font-mono select-text text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>Firestore Integration:</span>
                  <span className="text-emerald-400 font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>Gemini Orchestrator:</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Container Runtime:</span>
                  <span className="text-indigo-400">CLOUD RUN v2</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl flex items-start gap-2.5 text-[10px] leading-normal text-slate-500">
              <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <p>Mubuslink system architecture operates securely within GCP Cloud Run sandboxes. Data sync runs in a neutral container loop.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
