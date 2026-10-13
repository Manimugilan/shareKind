import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ProcurementOrder, OrderStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Truck, CheckCircle2, Box, PackageCheck, ShieldCheck, 
  Clock, ArrowRight, Eye, RefreshCw, AlertCircle, Building2, Store, UserCheck
} from 'lucide-react';

export const ProcurementOrdersPage: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<ProcurementOrder[]>(() => api.getOrders(currentUser));
  const [selectedOrder, setSelectedOrder] = useState<ProcurementOrder | null>(null);

  const reloadOrders = () => {
    setOrders(api.getOrders(currentUser));
  };

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = api.updateOrderStatus(currentUser, orderId, nextStatus);
      reloadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...updated });
      }
      showToast(`Order status transitioned to '${nextStatus.replace('_', ' ').toUpperCase()}'!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Status transition failed', 'error');
    }
  };

  const stages: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'placed', label: 'Placed by NGO', icon: Clock },
    { key: 'accepted', label: 'Supplier Accepted', icon: CheckCircle2 },
    { key: 'in_preparation', label: 'In Preparation', icon: Box },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck },
    { key: 'confirmed_distribution', label: 'Verified Distribution', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Procurement Orders & Logistics State Machine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fulfillment pipeline tracking orders from quote approval to final community distribution.
          </p>
        </div>

        <button
          onClick={reloadOrders}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-1.5 self-start cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((ord) => {
          const currentStageIdx = stages.findIndex(s => s.key === ord.status);

          return (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                
                {/* Order Top Bar */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{ord.id}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded capitalize">
                        {ord.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1">
                      {ord.quantity} Units via {ord.supplier_name}
                    </h3>
                  </div>
                  <StatusBadge status={ord.status} />
                </div>

                {/* Organization & Cost Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 my-3">
                  <div>
                    <span className="text-slate-400">Recipient NGO:</span>
                    <p className="font-bold text-slate-800">{ord.ngo_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Expenditure:</span>
                    <p className="font-bold text-teal-700">${ord.total_cost.toFixed(2)}</p>
                  </div>
                </div>

                {/* Visual Progress Stepper Bar */}
                <div className="my-5">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStageIdx / (stages.length - 1)) * 100)}%`
                      }}
                    />

                    {stages.map((stg, sIdx) => {
                      const isComplete = sIdx <= currentStageIdx;
                      const isCurrent = sIdx === currentStageIdx;
                      const Icon = stg.icon;

                      return (
                        <div key={stg.key} className="relative z-10 flex flex-col items-center group">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                              isCurrent
                                ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                                : isComplete
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                            title={stg.label}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>Placed</span>
                    <span>Dispatched</span>
                    <span>Confirmed</span>
                  </div>
                </div>

                {/* Impact Statement */}
                <p className="text-xs text-slate-600 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100/60 mb-4">
                  {ord.impact_summary}
                </p>

                {/* History Trail Snippet */}
                <div className="text-[11px] text-slate-400 space-y-1 mb-4">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Latest Log:</span>
                  {ord.history.slice(-1).map((h, hIdx) => (
                    <div key={hIdx} className="flex justify-between">
                      <span className="text-slate-600">{h.actor}</span>
                      <span>{new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* State Machine Action Controls based on Role */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                
                {/* Supplier Actions */}
                {ord.status === 'placed' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'accepted')}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Accept Order (Supplier)
                  </button>
                )}

                {ord.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'in_preparation')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Start Preparation (Supplier)
                  </button>
                )}

                {ord.status === 'in_preparation' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'dispatched')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Dispatch for Delivery (Supplier)
                  </button>
                )}

                {ord.status === 'dispatched' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Mark Delivered (Courier)
                  </button>
                )}

                {/* NGO Action: Final Verified Distribution Signoff */}
                {ord.status === 'delivered' && (
                  <button
                    onClick={() => handleUpdateStatus(ord.id, 'confirmed_distribution')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Receipt & Distribution (NGO Signoff)</span>
                  </button>
                )}

                {ord.status === 'confirmed_distribution' && (
                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Distribution Complete & Verified</span>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
