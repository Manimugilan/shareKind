import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { NGONeed, DonationCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ClipboardList, Plus, Store, CheckCircle2, 
  Clock, AlertCircle, Building2, MapPin, X
} from 'lucide-react';

interface NGONeedsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const NGONeedsPage: React.FC<NGONeedsPageProps> = ({ onNavigate }) => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();

  const [needs, setNeeds] = useState<NGONeed[]>(() => api.getNeeds());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // New Need Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DonationCategory>('food');
  const [quantity, setQuantity] = useState(100);
  const [budget, setBudget] = useState(400);
  const [urgency, setUrgency] = useState<'Urgent' | 'High' | 'Medium'>('High');
  const [location, setLocation] = useState(currentUser.location || 'Metro Downtown');

  const filteredNeeds = useMemo(() => {
    if (filterCategory === 'all') return needs;
    return needs.filter(n => n.category.toLowerCase() === filterCategory.toLowerCase());
  }, [needs, filterCategory]);

  const handleCreateNeed = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = api.createNeed(
        currentUser,
        title,
        category,
        quantity,
        budget,
        urgency,
        location
      );
      setNeeds(api.getNeeds());
      setShowCreateModal(false);
      showToast('New community requirement published successfully!', 'success');
      // Reset form
      setTitle('');
      setQuantity(100);
      setBudget(400);
    } catch (err: any) {
      showToast(err.message || 'Failed to publish need', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Community Needs & Requirements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish requirements for food, groceries, or clothing, and review incoming supplier procurement proposals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {currentRole === 'NGO' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Need</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl self-start max-w-sm">
        {['all', 'food', 'groceries', 'clothing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
              filterCategory === cat
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Needs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNeeds.map((need) => {
          const fulfillmentPct = Math.min(100, Math.round((need.fulfilled_quantity / need.target_quantity) * 100));
          return (
            <div
              key={need.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                    need.urgency === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : need.urgency === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {need.urgency} Urgency
                  </span>
                  <StatusBadge status={need.status} />
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {need.title}
                </h3>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-2">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold text-slate-700">{need.ngo_name}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{need.location}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Fulfilled:</span>
                    <span className="font-bold text-slate-900">
                      {need.fulfilled_quantity} / {need.target_quantity} units ({fulfillmentPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        fulfillmentPct >= 100 ? 'bg-emerald-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${fulfillmentPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Estimated Budget:</span>
                  <span className="font-bold text-slate-900">${need.budget_estimate}</span>
                </div>
              </div>

              {/* Action: Compare Suppliers */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('supplier-marketplace')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Store className="w-3.5 h-3.5 text-teal-400" />
                  <span>AI Compare Suppliers for This Need</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Publish New Need */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  Publish Community Need
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNeed} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title & Description of Requirement
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150 Fresh Evening Dinner Meals for Shelter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DonationCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="food">Prepared Meals (Food)</option>
                    <option value="groceries">Essential Groceries</option>
                    <option value="clothing">Warmth & Clothing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Urgent">Urgent (Immediate relief)</option>
                    <option value="High">High (Within 48h)</option>
                    <option value="Medium">Medium (Weekly replenishment)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Budget Estimate (USD)
                  </label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distribution / Delivery Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow cursor-pointer"
                >
                  Publish Need
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
