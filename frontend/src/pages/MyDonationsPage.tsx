import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Donation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Heart, Download, Eye, Filter, CheckCircle2, 
  Calendar, ShieldCheck, ArrowRight, Lock, Printer, X
} from 'lucide-react';

export const MyDonationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Strictly fetch ONLY this donor's donations
  const myDonations = useMemo(() => {
    return api.getDonations(currentUser);
  }, [currentUser]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return myDonations;
    return myDonations.filter(d => d.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [myDonations, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Privacy Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Private Donor Records &mdash; Isolated to {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            My Donations & Verified Impact
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track fulfillment milestones and digital receipts for every dollar you have contributed.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          {['all', 'food', 'groceries', 'clothing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Recipient NGO</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified Impact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                    {d.payment_ref || d.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {d.ngo_name}
                  </td>
                  <td className="py-3.5 px-4 capitalize">
                    {d.category}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ${d.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">
                    {d.impact}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedDonation(d)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold inline-flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No donations found for category filter "{categoryFilter}".
          </div>
        )}
      </div>

      {/* Donation Details & Lifecycle Milestone Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-heading">
                    Verified Contribution Audit Record
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Ref: {selectedDonation.payment_ref} &bull; ID: {selectedDonation.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contribution Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500">Donor Name:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedDonation.donor_name}</p>
              </div>
              <div>
                <span className="text-slate-500">Amount Contributed:</span>
                <p className="font-bold text-slate-900 text-base text-teal-700 mt-0.5">
                  ${selectedDonation.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Allocated Partner NGO:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedDonation.ngo_name}</p>
              </div>
              <div>
                <span className="text-slate-500">Humanitarian Impact:</span>
                <p className="font-bold text-emerald-700 mt-0.5">{selectedDonation.impact}</p>
              </div>
            </div>

            {/* Lifecycle Progress Stepper */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Procurement & Distribution Milestones
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Payment Confirmed & Secured</p>
                    <p className="text-slate-500 text-[11px]">Recorded into platform trust ledger.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Allocated to Verified Supplier Quote</p>
                    <p className="text-slate-500 text-[11px]">NGO approved competitive procurement order.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    ['dispatched', 'delivered', 'confirmed'].includes(selectedDonation.status)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Supplier Dispatched Relief Goods</p>
                    <p className="text-slate-500 text-[11px]">Physical logistics completed by local suppliers.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    ['delivered', 'confirmed'].includes(selectedDonation.status)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Final Distribution Verified by Shelter</p>
                    <p className="text-slate-500 text-[11px]">Digital signoff issued by beneficiary coordinator.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
