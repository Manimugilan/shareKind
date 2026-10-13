import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  Settings, UserCheck, Shield, Cloud, Server, 
  RotateCcw, CheckCircle2, AlertCircle, RefreshCw, Key
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, currentRole, availableUsers, switchUser } = useAuth();
  const { showToast } = useToast();

  const [backendUrl, setBackendUrl] = useState(api.backendUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const handleTestBackend = async () => {
    setIsTesting(true);
    api.backendUrl = backendUrl;
    localStorage.setItem('sharekind_backend_url', backendUrl);
    const online = await api.checkBackendHealth();
    setBackendOnline(online);
    setIsTesting(false);
    if (online) {
      showToast('Connected successfully to ShareKind FastAPI / Lambda backend!', 'success');
    } else {
      showToast('Backend offline. Seamless local mock repository active.', 'info');
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo records back to clean factory state?')) {
      api.resetToFactoryDemo();
      showToast('Demo records reset to factory state!', 'success');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Profile & Cloud Infrastructure Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage user identity, review RBAC role permissions, and inspect AWS serverless backend connection parameters.
        </p>
      </div>

      {/* User Identity Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 font-heading">{currentUser.name}</h2>
                {currentUser.verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    <Shield className="w-3 h-3 mr-1 text-teal-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <p className="text-xs text-slate-700 font-medium mt-1">
                {currentUser.organizationName || 'Individual Contributor'} &bull; {currentUser.location}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-teal-300">
            Role: {currentRole}
          </span>
        </div>

        {/* Quick User Switcher for Evaluator */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Switch Evaluator Profile
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                  u.id === currentUser.id
                    ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="truncate">{u.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{u.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AWS Cloud Architecture & API Connection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base font-heading">
            AWS Serverless & API Gateway Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Amazon DynamoDB Table:</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">sharekind-core-dev</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Amazon Cognito User Pool ID:</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">us-east-1_ShArEK1nd</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">Amazon S3 Analytics Bucket:</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">s3://sharekind-analytics-lake/</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">AWS Glue Data Catalog:</span>
            <p className="font-mono font-bold text-slate-900 mt-0.5">sharekind_analytics_db</p>
          </div>
        </div>

        {/* Local / Remote API Gateway Endpoint */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            REST API Gateway Endpoint
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleTestBackend}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
              <span>Test Connection</span>
            </button>
          </div>

          {backendOnline !== null && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
              backendOnline ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {backendOnline ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-slate-500" />}
              <span>
                {backendOnline
                  ? 'Connected to live FastAPI / AWS Lambda server at http://localhost:8000'
                  : 'Backend server not detected. Running seamlessly with local mock repository.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Demo Maintenance / Factory Reset */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Reset Synthetic Demo Dataset</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restores all 15 donations, 8 needs, 10 suppliers, and 5 procurement orders to their default seed states.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          className="px-4 py-2.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

    </div>
  );
};
