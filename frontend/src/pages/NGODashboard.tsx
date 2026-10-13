import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Building2, ClipboardList, Store, Truck, 
  ArrowRight, Plus, CheckCircle2, AlertCircle, TrendingUp, Users
} from 'lucide-react';

interface NGODashboardProps {
  onNavigate: (page: string) => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const myNeeds = useMemo(() => {
    return api.getNeeds().filter(n => n.ngo_id === currentUser.id);
  }, [currentUser]);

  const myOrders = useMemo(() => {
    return api.getOrders(currentUser);
  }, [currentUser]);

  const openNeedsCount = myNeeds.filter(n => n.status === 'open').length;
  const inTransitOrdersCount = myOrders.filter(o => ['accepted', 'in_preparation', 'dispatched'].includes(o.status)).length;
  const fulfilledOrdersCount = myOrders.filter(o => ['delivered', 'confirmed_distribution'].includes(o.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>NGO Operations Portal &mdash; {currentUser.organizationName || currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Community Shelter & Procurement Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish urgent community needs, compare vetted local supplier quotes, and verify deliveries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('ngo-needs')}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Need</span>
          </button>
          <button
            onClick={() => onNavigate('supplier-marketplace')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer shadow"
          >
            <Store className="w-4 h-4" />
            <span>AI Supplier Compare</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Open Needs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{openNeedsCount}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting supplier quote selection</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Orders In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-teal-600 font-heading">{inTransitOrdersCount}</div>
            <p className="text-xs text-slate-500 mt-1">Preparation & dispatch active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Fulfilled Batches</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600 font-heading">{fulfilledOrdersCount}</div>
            <p className="text-xs text-slate-500 mt-1">Delivered and impact verified</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Beneficiaries Served</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-purple-600 font-heading">1,420+</div>
            <p className="text-xs text-slate-500 mt-1">Shelter residents & children</p>
          </div>
        </div>

      </div>

      {/* Active Needs and Procurement Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Needs List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Current Community Requirements
            </h3>
            <button
              onClick={() => onNavigate('ngo-needs')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage Needs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {myNeeds.slice(0, 4).map((need) => (
              <div
                key={need.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {need.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{need.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target: {need.target_quantity} units &bull; Budget: ${need.budget_estimate}
                    </p>
                  </div>
                  <StatusBadge status={need.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Location: {need.location}
                  </span>
                  <button
                    onClick={() => onNavigate('supplier-marketplace')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-800 cursor-pointer"
                  >
                    Compare Quotes &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Procurement Orders Tracking */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Active Procurement Orders
            </h3>
            <button
              onClick={() => onNavigate('procurement-orders')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {myOrders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{ord.id}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{ord.supplier_name}</h4>
                    <p className="text-xs text-slate-500">
                      {ord.quantity} units ({ord.category}) &bull; ${ord.total_cost.toFixed(2)}
                    </p>
                  </div>
                  <StatusBadge status={ord.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[200px]">{ord.impact_summary}</span>
                  <button
                    onClick={() => onNavigate('procurement-orders')}
                    className="font-bold text-teal-600 hover:text-teal-800 cursor-pointer"
                  >
                    Track Status &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
