import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { DonationCategory } from '../types';
import { ClientAIEngine } from '../utils/aiEngine';
import { 
  Store, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, 
  Clock, Truck, DollarSign, ArrowRight, Info, Check, Filter
} from 'lucide-react';

interface SupplierMarketplacePageProps {
  onNavigate: (page: string) => void;
}

export const SupplierMarketplacePage: React.FC<SupplierMarketplacePageProps> = ({ onNavigate }) => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();

  const [category, setCategory] = useState<DonationCategory>('food');
  const [requestedQty, setRequestedQty] = useState<number>(100);

  // Compute explainable AI ranked quotes
  const rankedQuotes = useMemo(() => {
    return api.compareAndRankSuppliers(requestedQty, category);
  }, [category, requestedQty]);

  // Handle Order Approval by NGO
  const handleApproveQuote = (supplierId: string, supplierName: string, totalCost: number) => {
    if (currentRole !== 'NGO') {
      showToast('RBAC Notice: Switch role to NGO to approve procurement quotes.', 'error');
      return;
    }

    try {
      // Find an active open need matching this category, or default to need-1
      const openNeeds = api.getNeeds().filter(n => n.category.toLowerCase() === category.toLowerCase());
      const targetNeedId = openNeeds[0]?.id || 'need-1';

      const order = api.createProcurementOrder(
        currentUser,
        targetNeedId,
        supplierId,
        requestedQty
      );

      showToast(`Procurement order #${order.id} approved and placed with ${supplierName} ($${totalCost.toFixed(2)})!`, 'success');
      onNavigate('procurement-orders');
    } catch (err: any) {
      showToast(err.message || 'Failed to place procurement order', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Interactive Sizing Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Explainable AI Supplier Procurement Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Supplier Marketplace & Cost Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare local restaurants, grocers, and apparel wholesalers with transparent mathematical breakdowns.
          </p>
        </div>

        {/* Input Parameters: Category & Quantity */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DonationCategory)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:border-teal-500"
            >
              <option value="food">Prepared Meals (Food)</option>
              <option value="groceries">Essential Groceries</option>
              <option value="clothing">Clothing & Apparel</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Batch Quantity
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="10"
                step="10"
                value={requestedQty}
                onChange={(e) => setRequestedQty(Math.max(1, Number(e.target.value)))}
                className="w-28 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-teal-500"
              />
              <span className="text-xs text-slate-500 font-medium">units</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Ranking Formula Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-white">Explainable Weighting Model:</strong> Cost Efficiency (35%) &bull; Reliability & Verification (30%) &bull; Fulfillment Speed (20%) &bull; Stock Capacity (15%).
          </span>
        </div>
        <span className="text-[11px] bg-slate-800 text-teal-300 px-2.5 py-1 rounded-full border border-slate-700 shrink-0">
          Rule-Based Deterministic Scoring
        </span>
      </div>

      {/* Ranked Quotes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rankedQuotes.map((quote, idx) => {
          const isTopPick = quote.is_recommended || idx === 0;
          return (
            <div
              key={quote.supplier_id}
              className={`rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                isTopPick
                  ? 'bg-gradient-to-b from-teal-50/70 via-white to-white border-teal-500 shadow-md ring-1 ring-teal-500/20'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                
                {/* Header with Rank & Recommendation */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        #{idx + 1}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {quote.supplier_name}
                      </h3>
                      {quote.factor_scores.reliability_trust >= 70 && (
                        <span title="Verified Partner">
                          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 capitalize">
                      Category: {quote.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-900 text-teal-200">
                      Score: {quote.composite_score} / 100
                    </div>
                    {isTopPick && (
                      <span className="block text-[10px] font-bold text-emerald-700 mt-1 uppercase">
                        AI Recommended
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Breakdown Calculation */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 my-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Unit Price ({requestedQty} &times; ${quote.unit_price.toFixed(2)}):</span>
                    <span className="font-semibold text-slate-900">
                      ${(quote.unit_price * requestedQty).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery & Logistics Fee:</span>
                    <span className="font-semibold text-slate-900">
                      ${quote.delivery_fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Calculated Procurement Cost:</span>
                    <span className="text-teal-700 font-heading text-base">
                      ${quote.total_procurement_cost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Multi-Factor Radar / Bar Breakdown */}
                <div className="space-y-2 mb-4 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Factor Performance Scores
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Cost Value:</span>
                      <span className="font-bold text-slate-800">{quote.factor_scores.cost_efficiency}%</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Trust & Safety:</span>
                      <span className="font-bold text-slate-800">{quote.factor_scores.reliability_trust}%</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Delivery Speed:</span>
                      <span className="font-bold text-slate-800">{quote.factor_scores.fulfillment_speed}%</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                      <span className="text-slate-500">Stock Capacity:</span>
                      <span className="font-bold text-slate-800">{quote.factor_scores.stock_capacity}%</span>
                    </div>
                  </div>
                </div>

                {/* Explainability Justifications */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                  {quote.explainability_reasons.map((reason, rIdx) => (
                    <div key={rIdx} className="flex items-start space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Button: NGO Quote Approval */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleApproveQuote(quote.supplier_id, quote.supplier_name, quote.total_procurement_cost)}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer shadow ${
                    isTopPick
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Approve Quote & Place Order (${quote.total_procurement_cost.toFixed(2)})
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
