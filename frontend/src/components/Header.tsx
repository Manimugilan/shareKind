import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  HeartHandshake, Bell, ChevronDown, Shield, Users, 
  Store, UserCheck, AlertTriangle, Sparkles, LogOut, Check
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, currentRole, switchRole, switchUser, availableUsers } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'DONOR', label: 'Donor (Sarah J.)', icon: HeartHandshake, color: 'text-rose-500' },
    { role: 'NGO', label: 'NGO (Hope Haven)', icon: Users, color: 'text-teal-600' },
    { role: 'SUPPLIER', label: 'Supplier (Harvest)', icon: Store, color: 'text-amber-500' },
    { role: 'ADMIN', label: 'Admin (Compliance)', icon: Shield, color: 'text-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Demo Notification Strip */}
      <div className="bg-gradient-to-r from-teal-800 via-slate-900 to-indigo-950 px-4 py-1 text-xs text-teal-200 flex items-center justify-between border-b border-teal-700/30">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            DEMO MODE
          </span>
          <span className="hidden sm:inline">
            Synthetic community dataset active. Payments simulated for evaluation — no real funds transferred.
          </span>
          <span className="sm:hidden">Demo Mode Active</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            AWS Ready (DynamoDB / Lambda)
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20">
              <HeartHandshake className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  Share<span className="text-teal-400">Kind</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-900 text-teal-300 border border-teal-700">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Smart Donation & Procurement Platform
              </p>
            </div>
          </div>

          {/* CPPE Module Quick Links */}
          <div className="hidden xl:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onNavigate('module1-platform')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPage === 'module1-platform' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Mod 1: Platform
            </button>
            <button
              onClick={() => onNavigate('module2-bigdata')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPage === 'module2-bigdata' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Mod 2: Big Data
            </button>
            <button
              onClick={() => onNavigate('module3-genai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPage === 'module3-genai' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Mod 3: GenAI & RAG
            </button>
            <button
              onClick={() => onNavigate('module4-security')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPage === 'module4-security' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              Mod 4: Security & KMS
            </button>
          </div>

          {/* Quick Evaluator Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer shadow-sm"
                title="Switch active user role for testing"
              >
                <span className="text-slate-400 hidden lg:inline">Role:</span>
                <span className="font-semibold text-teal-300 flex items-center space-x-1">
                  <span>{currentRole}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Evaluator Role
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = currentRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition cursor-pointer ${
                          isActive ? 'bg-teal-950/60 text-teal-300 font-semibold' : 'text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${r.color}`} />
                          <span>{r.label}</span>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-teal-400" />}
                      </button>
                    );
                  })}
                  <div className="mt-2 pt-2 border-t border-slate-800 px-3 py-1">
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Instantly toggles backend RBAC permissions and UI role views.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowRoleMenu(false);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
                    <span>Notifications & Activity</span>
                    <span className="text-[10px] bg-teal-900 text-teal-300 px-1.5 py-0.5 rounded">3 New</span>
                  </div>
                  <div className="divide-y divide-slate-800 text-xs mt-1">
                    <div className="py-2">
                      <p className="text-white font-medium">Order #ord-103 Confirmed</p>
                      <p className="text-slate-400 text-[11px]">Grace Community Kitchen verified receipt of 300 meals.</p>
                      <span className="text-[10px] text-teal-400">2 hours ago</span>
                    </div>
                    <div className="py-2">
                      <p className="text-white font-medium">New Urgent Need Published</p>
                      <p className="text-slate-400 text-[11px]">Hope Haven Shelter requested 50 emergency food kits.</p>
                      <span className="text-[10px] text-slate-400">4 hours ago</span>
                    </div>
                    <div className="py-2">
                      <p className="text-white font-medium">Supplier Verified</p>
                      <p className="text-slate-400 text-[11px]">Harvest Caterers accredited with 98% reliability score.</p>
                      <span className="text-[10px] text-slate-400">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowRoleMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-teal-500/50"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center space-x-1">
                    <span className="truncate max-w-[110px]">{currentUser.name}</span>
                    {currentUser.verified && <Shield className="w-3 h-3 text-teal-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                    <div className="mt-1 flex items-center space-x-1 text-[11px] text-teal-400">
                      <UserCheck className="w-3 h-3" />
                      <span>Role: {currentUser.role}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                    >
                      Profile & Cloud Settings
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('analytics');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                    >
                      Impact Analytics & S3 Data Lake
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2 px-3">
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">Demo Accounts</div>
                    {availableUsers.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left text-xs py-1 px-1.5 rounded flex items-center justify-between ${
                          u.id === currentUser.id ? 'bg-teal-950 text-teal-300 font-medium' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{u.name} ({u.role})</span>
                        {u.id === currentUser.id && <Check className="w-3 h-3 text-teal-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
