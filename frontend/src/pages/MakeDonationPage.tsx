import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { DonationCategory } from '../types';
import { ClientAIEngine } from '../utils/aiEngine';
import { 
  Heart, Utensils, ShoppingBag, Shirt, Sparkles, 
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, 
  CreditCard, Lock, Building, DollarSign
} from 'lucide-react';

interface MakeDonationPageProps {
  onNavigate: (page: string) => void;
}

export const MakeDonationPage: React.FC<MakeDonationPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [category, setCategory] = useState<DonationCategory>('food');
  const [amount, setAmount] = useState<number>(100);
  const [selectedNgoId, setSelectedNgoId] = useState<string>('ngo-1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);

  const ngos = [
    { id: 'ngo-1', name: 'Hope Haven Shelter', location: 'Metro Downtown', verified: true, needs: 'Hot meals & emergency packs' },
    { id: 'ngo-2', name: 'Sunrise Child Foundation', location: 'North Suburbs', verified: true, needs: 'Winter jackets & school wear' },
    { id: 'ngo-3', name: 'GreenLeaf Elder Care', location: 'East Valley', verified: true, needs: 'Elder dietary groceries' },
    { id: 'ngo-4', name: 'Grace Community Kitchen', location: 'South End', verified: false, needs: 'Soup kitchen bulk ingredients' }
  ];

  const impactPreview = ClientAIEngine.estimateImpact(amount, category);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Please enter a valid donation amount greater than 0', 'error');
      return;
    }
    setShowSimulatedModal(true);
  };

  const handleConfirmSimulatedPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const donation = api.createDonation(currentUser, amount, category, selectedNgoId);
        setIsProcessing(false);
        setShowSimulatedModal(false);
        showToast(`Simulated contribution of $${amount.toFixed(2)} recorded successfully!`, 'success');
        onNavigate('my-donations');
      } catch (err: any) {
        setIsProcessing(false);
        showToast(err.message || 'Donation failed', 'error');
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Title & Context */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Make a Direct Impact Contribution
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Every contribution is recorded to your private dashboard and allocated directly toward verified procurement orders.
        </p>
      </div>

      {/* Simulated Payment Notice (Mandatory Requirement) */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3 text-xs leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prototype Simulation Notice:</span> This platform operates in evaluation demo mode. Payments are simulated purely for workflow demonstration. No actual funds are charged, no credit card numbers are stored, and no tax receipt claims are executed without independent legal verification.
        </div>
      </div>

      <form onSubmit={handleStartPayment} className="space-y-8">
        
        {/* Step 1: Category Selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">1</span>
            <span>Select Support Category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              type="button"
              onClick={() => setCategory('food')}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                category === 'food'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Nutritious Meals</h4>
                <p className="text-[11px] text-slate-500 mt-1">Hot cooked meals prepared by local vetted caterers & diners ($3.50/meal).</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('groceries')}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                category === 'groceries'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Family Groceries</h4>
                <p className="text-[11px] text-slate-500 mt-1">1-week grocery staple rations (rice, lentils, oil, milk) from wholesalers ($25/box).</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('clothing')}
              className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                category === 'clothing'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Warmth & Apparel</h4>
                <p className="text-[11px] text-slate-500 mt-1">Winter thermal coats, sweaters, and blankets for children & elders ($40/set).</p>
              </div>
            </button>

          </div>
        </div>

        {/* Step 2: Target Verified NGO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">2</span>
            <span>Select Recipient Organization</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ngos.map((ngo) => (
              <label
                key={ngo.id}
                className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 transition ${
                  selectedNgoId === ngo.id
                    ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="recipientNgo"
                  checked={selectedNgoId === ngo.id}
                  onChange={() => setSelectedNgoId(ngo.id)}
                  className="mt-1 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{ngo.name}</span>
                    {ngo.verified && <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ngo.location} &bull; {ngo.needs}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Amount & AI Impact Calculator */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">3</span>
            <span>Donation Amount & Verified Impact</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {[25, 50, 100, 250, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  amount === preset
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative max-w-xs">
            <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="5"
              step="5"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* AI Impact Estimation Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-teal-900 to-slate-900 text-white border border-teal-700/50 space-y-2">
            <div className="flex items-center space-x-1.5 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>AI Humanitarian Impact Calculator</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-heading text-teal-100">
              {impactPreview.units} {impactPreview.label}
            </div>
            <p className="text-xs text-slate-300">
              {impactPreview.text}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm sm:text-base hover:from-teal-400 hover:to-emerald-400 transition shadow-xl shadow-teal-500/20 flex items-center space-x-2 cursor-pointer"
          >
            <span>Review & Simulate Contribution (${amount.toFixed(2)})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>

      {/* Simulated Payment Confirmation Modal */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Simulated Sandbox Payment
              </h3>
              <p className="text-xs text-slate-500">
                You are executing a test contribution in ShareKind Demo Mode.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Donor Name:</span>
                <span className="font-semibold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Category:</span>
                <span className="font-semibold text-slate-900 capitalize">{category}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recipient NGO:</span>
                <span className="font-semibold text-slate-900">
                  {ngos.find(n => n.id === selectedNgoId)?.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Impact:</span>
                <span className="font-semibold text-emerald-700">{impactPreview.units} {impactPreview.label}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-[11px] text-teal-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Simulated Payment Gateway: No actual credit card data entered or stored.</span>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowSimulatedModal(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSimulatedPayment}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow"
              >
                {isProcessing ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Record</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
