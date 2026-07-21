import { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";
import { Route, BusinessLink } from "../types";

interface RoutesSchedulesProps {
  routes: Route[];
  links: BusinessLink[];
  onAddRoute: (route: Omit<Route, "id">) => void;
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (id: string) => void;
}

export default function RoutesSchedules({
  routes,
  links,
  onAddRoute,
  onEditRoute,
  onDeleteRoute
}: RoutesSchedulesProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(routes[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [routeName, setRouteName] = useState("");
  const [routeRegion, setRouteRegion] = useState("");
  const [routeStatus, setRouteStatus] = useState<Route["status"]>("active");
  const [routeStops, setRouteStops] = useState("");
  const [routeVehicles, setRouteVehicles] = useState("");
  const [routeDrivers, setRouteDrivers] = useState("");
  const [routeLinkedResources, setRouteLinkedResources] = useState<string[]>([]);

  // Find active route
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0] || null;

  const openAdd = () => {
    setRouteName("");
    setRouteRegion("");
    setRouteStatus("active");
    setRouteStops("");
    setRouteVehicles("");
    setRouteDrivers("");
    setRouteLinkedResources([]);
    setIsAddModalOpen(true);
  };

  const openEdit = (route: Route) => {
    setRouteName(route.name);
    setRouteRegion(route.region);
    setRouteStatus(route.status);
    setRouteStops(route.stops.join(", "));
    setRouteVehicles(route.vehicles.join(", "));
    setRouteDrivers(route.drivers.join(", "));
    setRouteLinkedResources(route.linkedResources);
    setIsEditModalOpen(true);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName || !routeRegion) return;
    onAddRoute({
      name: routeName,
      region: routeRegion,
      status: routeStatus,
      stops: routeStops.split(",").map(s => s.trim()).filter(Boolean),
      timetable: {
        "Weekdays": ["07:00", "12:00", "17:00"],
        "Weekends": ["09:00", "15:00"]
      },
      vehicles: routeVehicles.split(",").map(v => v.trim()).filter(Boolean),
      drivers: routeDrivers.split(",").map(d => d.trim()).filter(Boolean),
      linkedResources: routeLinkedResources
    });
    setIsAddModalOpen(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoute) return;
    onEditRoute({
      id: activeRoute.id,
      name: routeName,
      region: routeRegion,
      status: routeStatus,
      stops: routeStops.split(",").map(s => s.trim()).filter(Boolean),
      timetable: activeRoute.timetable,
      vehicles: routeVehicles.split(",").map(v => v.trim()).filter(Boolean),
      drivers: routeDrivers.split(",").map(d => d.trim()).filter(Boolean),
      linkedResources: routeLinkedResources
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6" id="routes-schedules">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Route Scroller list (5 columns) */}
        <div className="lg:w-[350px] shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-slate-500 font-mono tracking-widest pl-1">Route Fleet Dispatch</h3>
            <button 
              onClick={openAdd}
              className="p-1 px-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors select-none"
            >
              <Plus size={10} /> Add Route
            </button>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {routes.length === 0 ? (
              <p className="text-slate-600 text-xs italic">No route schedules defined.</p>
            ) : (
              routes.map((route) => {
                const isActive = selectedRouteId === route.id;
                return (
                  <div 
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold' 
                        : 'bg-slate-900/30 border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500">ID: {route.id.toUpperCase()}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                        route.status === "active" 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                          : "bg-slate-950 text-slate-600 border border-slate-900"
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1 truncate select-text">{route.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block truncate"><MapPin size={10} className="inline mr-1" /> {route.region}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Route Detail Board (Remaining) */}
        <div className="flex-1 space-y-6">
          {activeRoute ? (
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
              
              {/* Route Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-900 font-mono font-bold">ROUTE DETAIL WORKSPACE</span>
                    <span className="text-slate-600 font-black">•</span>
                    <span className="text-slate-400 text-[10px] font-mono">{activeRoute.region}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-white font-display select-text">{activeRoute.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(activeRoute)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl text-slate-300 hover:text-white transition-colors"
                    title="Edit route specs"
                  >
                    <Edit size={13} />
                  </button>
                  <button 
                    onClick={() => onDeleteRoute(activeRoute.id)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete route schedule"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Stops timeline */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-widest pl-1">Sitemap Routing Stops</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-1 px-3 py-2 bg-slate-950/60 rounded-2xl border border-slate-900">
                  {activeRoute.stops.map((stop, si) => (
                    <div key={si} className="flex items-center gap-1 shrink-0 flex-wrap">
                      <div className="flex items-center gap-1.5 p-2 px-3 bg-slate-900 border border-slate-850 rounded-xl select-all">
                        <MapPin size={11} className="text-emerald-400" />
                        <span className="text-[11px] font-bold text-white">{stop}</span>
                      </div>
                      {si < activeRoute.stops.length - 1 && (
                        <span className="text-slate-600 font-bold hidden sm:inline px-1">➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Timetable schedule editor display */}
                <div className="space-y-3 p-5 bg-slate-950/45 rounded-2xl border border-slate-900">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 font-mono tracking-widest flex items-center gap-1">
                    <Clock size={11} /> <span>Active Run Times</span>
                  </h4>
                  <div className="space-y-2 pt-2 text-[11px] font-mono">
                    {Object.entries(activeRoute.timetable || {}).map(([dayKey, times]) => (
                      <div key={dayKey} className="flex items-center justify-between py-1.5 border-b border-slate-900">
                        <span className="text-slate-500 font-semibold">{dayKey}:</span>
                        <div className="flex flex-wrap gap-1">
                          {times.map((t, ti) => (
                            <span key={ti} className="px-1.5 py-0.5 bg-slate-9 Seattle-depot rounded border border-slate-800 text-slate-200 select-all font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Drivers & Vehicles */}
                <div className="space-y-4">
                  {/* Drivers */}
                  <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-2xl space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-purple-400 font-mono tracking-widest flex items-center gap-1">
                      <User size={11} /> <span>Assigned Fleet Drivers</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {activeRoute.drivers.map((drv, di) => (
                        <span key={di} className="px-2.5 py-1 bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20 rounded-xl text-xs flex items-center gap-1 select-all">
                          <User size={10} className="text-purple-400" />
                          <span>{drv}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vehicles */}
                  <div className="p-4 bg-slate-950/45 border border-slate-900 rounded-2xl space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-blue-400 font-mono tracking-widest flex items-center gap-1">
                      <Truck size={11} /> <span>Assigned Coach Vehicles</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {activeRoute.vehicles.map((vh, vi) => (
                        <span key={vi} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20 rounded-xl text-xs flex items-center gap-1 select-all">
                          <Truck size={10} className="text-blue-400" />
                          <span>{vh}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Linked Business resources inside route */}
              <div className="p-5 bg-slate-950/45 border border-slate-900 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-widest flex items-center gap-1">
                  <FileText size={11} className="text-emerald-400" />
                  <span>Linked Business Resources (Integrations)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {activeRoute.linkedResources.map((resId) => {
                    const linkedLink = links.find(l => l.id === resId);
                    if (!linkedLink) return null;
                    return (
                      <a 
                        key={resId}
                        href={linkedLink.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-850 flex items-center justify-between transition-all group"
                      >
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block mb-0.5">RESOURCE</span>
                          <span className="text-xs font-bold text-slate-250 truncate block group-hover:text-emerald-400 transition-colors">{linkedLink.title}</span>
                        </div>
                        <ExternalLink size={11} className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0 ml-2" />
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl border-dashed">
              <Truck size={40} className="text-slate-600 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-slate-400">Select or Add a Route to view Schedule Specs</h4>
            </div>
          )}
        </div>
      </div>

      {/* ADD ROUTE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Add Fleet Route</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitAdd} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Route Name / Identifier</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Cascade Shuttles (Route 303)"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Operating Region</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Northwest Corridor"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeRegion}
                  onChange={(e) => setRouteRegion(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={routeStatus}
                    onChange={(e) => setRouteStatus(e.target.value as any)}
                  >
                    <option value="active">Active (On Schedule)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Assigned Coach Vehicles</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Bus #302, Bus #305"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={routeVehicles}
                    onChange={(e) => setRouteVehicles(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Stops (Comma Sep)</label>
                <input 
                  type="text" 
                  placeholder="Seattle Center, Tacoma Hub, Portland Station"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeStops}
                  onChange={(e) => setRouteStops(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Assigned Drivers (Comma Sep)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Marcus Vance, David Miller"
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeDrivers}
                  onChange={(e) => setRouteDrivers(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Link Operations Resources</label>
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-900 max-h-[120px] overflow-y-auto">
                  {links.map((link) => {
                    const isChecked = routeLinkedResources.includes(link.id);
                    return (
                      <label key={link.id} className="flex items-center gap-2 py-1 select-none text-slate-350 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setRouteLinkedResources(prev => prev.filter(id => id !== link.id));
                            } else {
                              setRouteLinkedResources(prev => [...prev, link.id]);
                            }
                          }}
                          className="rounded text-emerald-500 border-slate-800 bg-slate-900 focus:ring-emerald-500"
                        />
                        <span>{link.title}</span>
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
                  Register Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROUTE MODAL */}
      {isEditModalOpen && activeRoute && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 font-display">Edit Route Specs</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white">
                <Plus size={16} className="transform rotate-45" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Route Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Operating Region</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeRegion}
                  onChange={(e) => setRouteRegion(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={routeStatus}
                    onChange={(e) => setRouteStatus(e.target.value as any)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Assigned Vehicles</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                    value={routeVehicles}
                    onChange={(e) => setRouteVehicles(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Stops (Comma Sep)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeStops}
                  onChange={(e) => setRouteStops(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Assigned Drivers</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none"
                  value={routeDrivers}
                  onChange={(e) => setRouteDrivers(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Link Operations Resources</label>
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-900 max-h-[120px] overflow-y-auto">
                  {links.map((link) => {
                    const isChecked = routeLinkedResources.includes(link.id);
                    return (
                      <label key={link.id} className="flex items-center gap-2 py-1 select-none text-slate-350 hover:text-white cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setRouteLinkedResources(prev => prev.filter(id => id !== link.id));
                            } else {
                              setRouteLinkedResources(prev => [...prev, link.id]);
                            }
                          }}
                          className="rounded text-emerald-500 border-slate-800 bg-slate-900 focus:ring-emerald-500"
                        />
                        <span>{link.title}</span>
                      </label>
                    );
                  })}
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
                  Save Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
