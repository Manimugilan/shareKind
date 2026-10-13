import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { 
  HeartHandshake, Shield, Users, Store, Lock, 
  ArrowRight, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginAsDemo, currentRole } = useAuth();
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isRegister, setIsRegister] = useState(false);

  // Form fields
  const [email, setEmail] = useState('sarah.j@example.com');
  const [password, setPassword] = useState('password123');

  const demoAccounts: { role: UserRole; name: string; email: string; org: string; icon: any; desc: string }[] = [
    {
      role: 'DONOR',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      org: 'Independent Contributor',
      icon: HeartHandshake,
      desc: 'Private dashboard, donation tracking, verified impact reports.'
    },
    {
      role: 'NGO',
      name: 'Hope Haven Shelter',
      email: 'director@hopehaven.org',
      org: 'Hope Haven Community Shelter',
      icon: Users,
      desc: 'Publish community needs, compare suppliers, approve orders.'
    },
    {
      role: 'SUPPLIER',
      name: 'Harvest Caterers & Kitchen',
      email: 'orders@harvestcaterers.com',
      org: 'Harvest Commercial Catering Ltd.',
      icon: Store,
      desc: 'Submit price quotes, accept assigned orders, update logistics status.'
    },
    {
      role: 'ADMIN',
      name: 'Alexandra Vance (Auditor)',
      email: 'admin@sharekind.org',
      org: 'ShareKind Global Compliance',
      icon: Shield,
      desc: 'Accredit NGOs & suppliers, inspect audit logs, export S3 data lake.'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const acc = demoAccounts.find(a => a.role === role);
    if (acc) {
      setEmail(acc.email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsDemo(selectedRole);
    showToast(`Logged in successfully as ${selectedRole}`, 'success');

    // Route based on role
    if (selectedRole === 'DONOR') onNavigate('donor-dashboard');
    else if (selectedRole === 'NGO') onNavigate('ngo-dashboard');
    else if (selectedRole === 'SUPPLIER') onNavigate('procurement-orders');
    else onNavigate('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
            <HeartHandshake className="w-7 h-7 text-slate-950 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Sign In to ShareKind
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Select an evaluator persona below for instant one-click sign-in.
          </p>
        </div>

        {/* Demo Persona Quick Switcher Cards */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Evaluator Role Presets</span>
            <span className="text-[11px] text-teal-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Click to test</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              const isSelected = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleRoleSelect(acc.role)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-md shadow-teal-900/30 ring-1 ring-teal-500'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{acc.role}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {acc.name.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Persona Details Box */}
        {selectedRole && (
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>{demoAccounts.find(a => a.role === selectedRole)?.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-900 text-teal-300">
                {selectedRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {demoAccounts.find(a => a.role === selectedRole)?.desc}
            </p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-400 transition shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continue as {selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-700/80 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Authentication Adapter &mdash; Amazon Cognito User Pools ready for production deployment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
