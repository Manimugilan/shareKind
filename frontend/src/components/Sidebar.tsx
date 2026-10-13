import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Heart, History, ClipboardList, Store, 
  Truck, ShieldCheck, BarChart3, Settings, ShieldAlert, 
  Home, LogIn, Sparkles, Building2, ChevronRight, Workflow, Database, Lock
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen }) => {
  const { currentRole } = useAuth();

  const getNavItems = () => {
    const common = [
      { id: 'landing', label: 'Platform Home', icon: Home, section: 'Overview' },
    ];

    const cppeModules = [
      { id: 'module1-platform', label: 'Mod 1: Platform & CI/CD', icon: Workflow, section: 'Wipro CPPE Modules' },
      { id: 'module2-bigdata', label: 'Mod 2: Big Data & ML', icon: Database, section: 'Wipro CPPE Modules' },
      { id: 'module3-genai', label: 'Mod 3: GenAI & RAG', icon: Sparkles, section: 'Wipro CPPE Modules' },
      { id: 'module4-security', label: 'Mod 4: Security & KMS', icon: Lock, section: 'Wipro CPPE Modules' },
    ];

    const donorItems = [
      { id: 'donor-dashboard', label: 'My Impact Dashboard', icon: LayoutDashboard, section: 'Donor Services' },
      { id: 'make-donation', label: 'Make a Contribution', icon: Heart, section: 'Donor Services' },
      { id: 'my-donations', label: 'My Donations & History', icon: History, section: 'Donor Services' },
    ];

    const ngoItems = [
      { id: 'ngo-dashboard', label: 'NGO Operations', icon: LayoutDashboard, section: 'NGO Management' },
      { id: 'ngo-needs', label: 'Needs & Requests', icon: ClipboardList, section: 'NGO Management' },
      { id: 'supplier-marketplace', label: 'Supplier Marketplace', icon: Store, section: 'Procurement' },
      { id: 'procurement-orders', label: 'Procurement & Delivery', icon: Truck, section: 'Procurement' },
    ];

    const supplierItems = [
      { id: 'procurement-orders', label: 'Assigned Orders', icon: Truck, section: 'Supplier Portal' },
      { id: 'supplier-marketplace', label: 'Catalog & Quotes', icon: Store, section: 'Supplier Portal' },
    ];

    const adminItems = [
      { id: 'admin-dashboard', label: 'Governance & Verify', icon: ShieldCheck, section: 'Administration' },
      { id: 'analytics', label: 'Analytics & S3 Lake', icon: BarChart3, section: 'Administration' },
    ];

    const utilityItems = [
      { id: 'analytics', label: 'Community Analytics', icon: BarChart3, section: 'Insights' },
      { id: 'profile', label: 'Profile & Cloud Setup', icon: Settings, section: 'Settings' },
      { id: 'login', label: 'Auth & Role Switcher', icon: LogIn, section: 'Settings' },
      { id: 'access-denied', label: 'RBAC Boundary Test', icon: ShieldAlert, section: 'Settings' },
    ];

    // Combine role-specific items
    let roleSpecific = donorItems;
    if (currentRole === 'NGO') roleSpecific = ngoItems;
    else if (currentRole === 'SUPPLIER') roleSpecific = supplierItems;
    else if (currentRole === 'ADMIN') roleSpecific = adminItems;

    // Filter duplicates and merge
    const items = [...common, ...cppeModules, ...roleSpecific];
    utilityItems.forEach(u => {
      if (!items.find(i => i.id === u.id)) {
        items.push(u);
      }
    });

    return items;
  };

  const navItems = getNavItems();

  // Group by section
  const sections: { [key: string]: typeof navItems } = {};
  navItems.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col shrink-0 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName} className="space-y-1">
            {isOpen && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {sectionName}
              </div>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isOpen ? 'justify-between px-3' : 'justify-center px-0'
                  } py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-900/80 to-slate-800 text-teal-300 font-semibold border border-teal-700/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>
                  {isOpen && isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role Indicator Widget */}
      {isOpen && (
        <div className="p-3 m-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-teal-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Role: {currentRole}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {currentRole === 'DONOR' && 'Viewing private donor dashboard with strict personal isolation.'}
            {currentRole === 'NGO' && 'Manage community needs and procurement quote approvals.'}
            {currentRole === 'SUPPLIER' && 'Accept orders and update fulfillment delivery milestones.'}
            {currentRole === 'ADMIN' && 'Audit platform logs and verify NGO/Supplier credentials.'}
          </p>
        </div>
      )}
    </aside>
  );
};
