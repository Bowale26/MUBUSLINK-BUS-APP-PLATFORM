import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Truck,
  Ticket,
  Shield
} from "lucide-react";
import { Partner } from "../types";

interface VendorsPartnersProps {
  partners: Partner[];
  onAddPartner: (partner: Omit<Partner, "id">) => void;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (id: string) => void;
}

export default function VendorsPartners({
  partners,
  onAddPartner,
  onEditPartner,
  onDeletePartner
}: VendorsPartnersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState("Truck");
  const [partnerCategory, setPartnerCategory] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerStatus, setPartnerStatus] = useState("active");
  const [partnerRenewal, setPartnerRenewal] = useState("");
  const [partnerPortal, setPartnerPortal] = useState("");
  const [partnerSupport, setPartnerSupport] = useState("");
  const [partnerSLA, setPartnerSLA] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search logic
  const filteredPartners = partners.filter(p => {
    return searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openAdd = () => {
    setPartnerName("");
    setPartnerLogo("Truck");
    setPartnerCategory("");
    setPartnerEmail("");
    setPartnerPhone("");
    setPartnerStatus("active");
    setPartnerRenewal("");
    setPartnerPortal("");
    setPartnerSupport("");
    setPartnerSLA("");
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setPartnerName(partner.name);
    setPartnerLogo(partner.logo);
    setPartnerCategory(partner.category);
    setPartnerEmail(partner.contact.email);
    setPartnerPhone(partner.contact.phone);
    setPartnerStatus(partner.contractStatus);
    setPartnerRenewal(partner.renewalDate);
    setPartnerPortal(partner.links.portal);
    setPartnerSupport(partner.links.support);
    setPartnerSLA(partner.links.sla);
    setEditingId(partner.id);
    setIsEditModalOpen(true);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerCategory) return;
    onAddPartner({
      name: partnerName,
      logo: partnerLogo,
      category: partnerCategory,
      contact: { email: partnerEmail, phone: partnerPhone },
      contractStatus: partnerStatus,
      renewalDate: partnerRenewal || new Date(Date.now() + 31536000000).toISOString().split("T")[0],
      links: { portal: partnerPortal, support: partnerSupport, sla: partnerSLA }
    });
    setIsAddModalOpen(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    onEditPartner({
      id: editingId,
      name: partnerName,
      logo: partnerLogo,
      category: partnerCategory,
      contact: { email: partnerEmail, phone: partnerPhone },
      contractStatus: partnerStatus,
      renewalDate: partnerRenewal,
      links: { portal: partnerPortal, support: partnerSupport, sla: partnerSLA }
    });
    setIsEditModalOpen(false);
  };

  // Helper to render icon based on logo string
  const renderLogoIcon = (iconName: string) => {
    const size = 18;
    switch (iconName) {
      case "Ticket": return <Ticket size={size} />;
      case "Shield": return <Shield size={size} />;
      case "Zap": return <Zap size={size} />;
      default: return <Truck size={size} />;
    }
  };

  return (
    <div className="space-y-6" id="vendors-partners">
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/20 p-4 border border-slate-900 rounded-3xl">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950 border border-slate-900 rounded-xl max-w-md w-full">
          <Search size={14} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search vendor name, system types..." 
            className="bg-transparent text-xs text-slate-100 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer select-none"
        >
          <Plus size={14} className="font-black" />
          <span>Register Vendor</span>
        </button>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/15 border border-slate-900 rounded-3xl border-dashed">
          <User size={32} className="text-slate-600 mx-auto mb-3" />
          <h4 className="text-xs font-bold text-slate-400">No Partners Cataloged</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPartners.map((partner) => {
            // Check renewal warnings
            const renewalDate = new Date(partner.renewalDate);
            const daysLeft = Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 3600 * 24));
            const isWarning = daysLeft > 0 && daysLeft <= 60;

            return (
              <div 
                key={partner.id}
                className="bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-900/50 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-emerald-400">
                        {renderLogoIcon(partner.logo)}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white leading-tight select-text">{partner.name}</h4>
                        <span className="text-[10px] text-slate-500 font-medium font-mono block mt-0.5">{partner.category}</span>
                      </div>
                    </div>

                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                      partner.contractStatus === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      partner.contractStatus === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      partner.contractStatus === "expired" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      "bg-slate-950 text-slate-500 border border-slate-900"
                    }`}>
                      {partner.contractStatus}
                    </span>
                  </div>

                  {/* Contact particulars */}
                  <div className="space-y-1.5 py-3 border-t border-slate-900/60 text-[11px] font-mono select-text">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={11} className="text-slate-650" />
                      <span className="truncate">{partner.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={11} className="text-slate-650" />
                      <span>{partner.contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3.5 border-t border-slate-900/60 mt-auto">
                  {/* Renewal Warning Alert */}
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={11} />
                      <span>SLA Renews: {partner.renewalDate}</span>
                    </div>
                    {isWarning && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] flex items-center gap-1 font-bold">
                        <AlertTriangle size={10} /> {daysLeft}d left
                      </span>
                    )}
                  </div>

                  {/* External Resource Mappings */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[9px] font-black uppercase font-mono tracking-wider text-center">
                    <a 
                      href={partner.links.portal} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Portal</span>
                    </a>
                    <a 
                      href={partner.links.support} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Support</span>
                    </a>
                    <a 
                      href={partner.links.sla} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <span>SLA PDF</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                    <button 
                      onClick={() => openEdit(partner)}
                      className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-900"
                    >
                      <Edit size={11} />
                    </button>
                    <button 
                      onClick={() => onDeletePartner(partner.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD PARTNER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Onboard Partner Vendor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Allianz Insurances"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Service Icon</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerLogo}
                    onChange={(e) => setPartnerLogo(e.target.value)}
                  >
                    <option value="Truck">Truck (Fleet Operations)</option>
                    <option value="Ticket">Ticket (Distribution)</option>
                    <option value="Shield">Shield (Legal / Insurance)</option>
                    <option value="Zap">Zap (Infrastructure / EV)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Service Classification</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Commercial Auto Insurance"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={partnerCategory}
                  onChange={(e) => setPartnerCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contract Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerStatus}
                    onChange={(e) => setPartnerStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">SLA Renewal Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerRenewal}
                    onChange={(e) => setPartnerRenewal(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="ops@partner.com"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 012-3456"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3.5 border border-slate-900 rounded-xl">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Resource URLs Mapping</span>
                <div className="space-y-2 text-[10px]">
                  <input 
                    type="url" 
                    placeholder="Portal Access URL"
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerPortal}
                    onChange={(e) => setPartnerPortal(e.target.value)}
                  />
                  <input 
                    type="url" 
                    placeholder="Support Helpdesk URL"
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerSupport}
                    onChange={(e) => setPartnerSupport(e.target.value)}
                  />
                  <input 
                    type="url" 
                    placeholder="Governing SLA Document URL"
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerSLA}
                    onChange={(e) => setPartnerSLA(e.target.value)}
                  />
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
                  Onboard Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PARTNER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Edit Partner Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Service Icon</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerLogo}
                    onChange={(e) => setPartnerLogo(e.target.value)}
                  >
                    <option value="Truck">Truck</option>
                    <option value="Ticket">Ticket</option>
                    <option value="Shield">Shield</option>
                    <option value="Zap">Zap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Service Classification</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={partnerCategory}
                  onChange={(e) => setPartnerCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contract Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerStatus}
                    onChange={(e) => setPartnerStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">SLA Renewal Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none font-mono"
                    value={partnerRenewal}
                    onChange={(e) => setPartnerRenewal(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3.5 border border-slate-900 rounded-xl">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Resource URLs Mapping</span>
                <div className="space-y-2 text-[10px]">
                  <input 
                    type="url" 
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerPortal}
                    onChange={(e) => setPartnerPortal(e.target.value)}
                  />
                  <input 
                    type="url" 
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerSupport}
                    onChange={(e) => setPartnerSupport(e.target.value)}
                  />
                  <input 
                    type="url" 
                    className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500 rounded px-2.5 py-1.5 text-slate-100 outline-none"
                    value={partnerSLA}
                    onChange={(e) => setPartnerSLA(e.target.value)}
                  />
                </div>
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
                  Save SLA Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
