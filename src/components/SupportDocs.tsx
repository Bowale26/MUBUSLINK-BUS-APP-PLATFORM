import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Plus, 
  Send, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { faqItems } from "../data";

interface SupportDocsProps {
  onTriggerLog: (msg: string, type: "info" | "success" | "warning") => void;
}

export default function SupportDocs({ onTriggerLog }: SupportDocsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("all");
  
  // Incident ticket states
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Operations Sync");
  const [ticketBody, setTicketBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter FAQs
  const filteredFaqs = faqItems.filter(item => {
    const matchCategory = activeFaqCategory === "all" || item.category === activeFaqCategory;
    const matchSearch = searchTerm === "" || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categories = ["all", "Operations", "System Admin", "Marketing", "Routes & Schedules"];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onTriggerLog(`Incident ticket #${Math.floor(Math.random() * 90000 + 10000)} created: "${ticketSubject}". Dispatch notified.`, "success");
      setTicketSubject("");
      setTicketBody("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-6" id="support-docs">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/20 p-4 border border-slate-900 rounded-3xl">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950 border border-slate-900 rounded-xl max-w-md w-full">
          <Search size={14} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search operator manuals, FAQs, troubleshooting..." 
            className="bg-transparent text-xs text-slate-100 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <span className="text-[10px] text-slate-500 font-mono pr-2">24/7 Operations Helpdesk Active</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive FAQ & Docs (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <HelpCircle size={15} className="text-indigo-400" />
            <h3 className="text-xs font-black uppercase text-slate-250 font-mono tracking-widest">Operator FAQ & Knowledgebase</h3>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all shrink-0 border ${
                  activeFaqCategory === cat
                    ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold"
                    : "border-slate-900 bg-slate-950/45 text-slate-500 hover:text-slate-300"
                }`}
              >
                {cat === "all" ? "All FAQ" : cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-4">No troubleshooting documentation matches your search term.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-slate-900/20 border border-slate-900 rounded-2xl hover:border-slate-850 transition-colors">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900 font-bold uppercase mb-2 inline-block">
                    {faq.category}
                  </span>
                  <h4 className="text-xs font-black text-white select-text mb-1.5">{faq.question}</h4>
                  <p className="text-xs text-slate-450 leading-relaxed select-text">{faq.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Contact / Incident Ticket Form (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 h-fit space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
            <MessageSquare size={14} className="text-emerald-400" />
            <h3 className="text-xs font-black uppercase text-slate-100 font-display">Create Incident Ticket</h3>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Issue Subject</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Fleet Pro portal API sync timeout"
                className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Incident Category</label>
              <select 
                className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
              >
                <option value="Operations Sync">Operations Link Outage</option>
                <option value="SLA Inquiry">SLA Document Verification</option>
                <option value="Route Change">Route Schedule Bug</option>
                <option value="System Account">Dispatch Console Failure</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Problem Description</label>
              <textarea 
                rows={4}
                required
                placeholder="Describe the incident details, relevant route IDs, or failing URLs..."
                className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none resize-none leading-relaxed"
                value={ticketBody}
                onChange={(e) => setTicketBody(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send size={11} />
                  <span>Transmit Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
