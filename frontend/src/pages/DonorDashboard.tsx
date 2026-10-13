import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Heart, ShieldCheck, Utensils, Award, TrendingUp, 
  ArrowRight, Download, Lock, CheckCircle2, Building, Eye
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DonorDashboardProps {
  onNavigate: (page: string) => void;
}

const COLORS = ['#0d9488', '#10b981', '#6366f1', '#f59e0b'];

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  // Strictly fetch ONLY this donor's donations
  const myDonations = useMemo(() => {
    return api.getDonations(currentUser);
  }, [currentUser]);

  // Compute metrics
  const totalContributed = useMemo(() => {
    return myDonations.reduce((sum, d) => sum + d.amount, 0);
  }, [myDonations]);

  const uniqueOrgs = useMemo(() => {
    return new Set(myDonations.map(d => d.ngo_id)).size;
  }, [myDonations]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    myDonations.forEach(d => {
      const cat = d.category.charAt(0).toUpperCase() + d.category.slice(1);
      counts[cat] = (counts[cat] || 0) + d.amount;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [myDonations]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-900/80 border border-teal-600 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-teal-200">
              Private Donor Dashboard &mdash; {currentUser.name}
            </h4>
            <p className="text-[11px] sm:text-xs text-teal-300/80">
              Your contribution history and personal receipts are isolated and confidential. No public leaderboards exist.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('make-donation')}
          className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 flex items-center space-x-1.5 transition cursor-pointer shadow"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>New Donation</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Contributed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Contributions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">
              ${totalContributed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across {myDonations.length} verified donations</p>
          </div>
        </div>

        {/* Impact Units */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Verified Hot Meals</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-600 font-heading">
              {Math.floor(totalContributed / 3.5)} Meals
            </div>
            <p className="text-xs text-slate-500 mt-1">Directly delivered to community shelters</p>
          </div>
        </div>

        {/* Supported Organizations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Supported NGOs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-indigo-600 font-heading">
              {uniqueOrgs} Organizations
            </div>
            <p className="text-xs text-slate-500 mt-1">Shelters, orphanages & senior care</p>
          </div>
        </div>

        {/* Impact Accreditation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Verification Status</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>100% Tracked</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Audited procurement pipeline</p>
          </div>
        </div>

      </div>

      {/* Middle Grid: Category Breakdown Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Allocation Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-slate-900 font-heading mb-1">
            Donation Category Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of your personal funding allocations</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Contributed']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Donations & Fulfillment Status Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Recent Donations & Verified Milestones
              </h3>
              <p className="text-xs text-slate-500">Track delivery of physical items bought with your contributions</p>
            </div>
            <button
              onClick={() => onNavigate('my-donations')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Recipient NGO</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myDonations.slice(0, 5).map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(don.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {don.ngo_name}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-600">
                      {don.category}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ${don.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={don.status} />
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-emerald-700">
                      {don.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Verified Distribution Certificates Showcase */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cryptographic Digital Distribution Receipts</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading">
            Audit-Ready Verified Humanitarian Outcomes
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every dollar allocated is verified with NGO digital signoffs and geo-tagged supplier fulfillment vouchers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => onNavigate('my-donations')}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download All Receipts (PDF)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
