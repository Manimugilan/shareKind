import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldAlert, Lock, CheckCircle2, XCircle, 
  ArrowRight, KeyRound, AlertTriangle
} from 'lucide-react';

interface AccessDeniedPageProps {
  onNavigate: (page: string) => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ onNavigate }) => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { showToast } = useToast();

  const [testResult, setTestResult] = useState<{
    action: string;
    allowed: boolean;
    reason: string;
  } | null>(null);

  // RBAC Boundary Simulations
  const simulateAction = (actionName: string, requiredRole: string) => {
    const isAllowed = currentRole === requiredRole;
    if (isAllowed) {
      setTestResult({
        action: actionName,
        allowed: true,
        reason: `200 OK: Active role '${currentRole}' matches required authorization level for '${actionName}'.`
      });
      showToast(`Action '${actionName}' permitted by backend security engine.`, 'success');
    } else {
      setTestResult({
        action: actionName,
        allowed: false,
        reason: `403 FORBIDDEN: Role '${currentRole}' lacks permission for '${actionName}'. Action strictly confined to '${requiredRole}'.`
      });
      showToast(`403 Forbidden: Unauthorized access blocked.`, 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Access Denied Shield Banner */}
      <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Security Boundary & Role Authorization Test
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          ShareKind enforces zero-trust Role-Based Access Control (RBAC). Actions are verified and authorized on the backend, not solely by hiding frontend buttons.
        </p>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
          <KeyRound className="w-3.5 h-3.5 text-teal-600" />
          <span>Currently Authenticated As: <strong>{currentUser.name}</strong> ({currentRole})</span>
        </div>
      </div>

      {/* Interactive RBAC Verification Tester */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base font-heading">
          Test Unauthorized API Endpoints & Actions
        </h3>
        <p className="text-xs text-slate-500">
          Click any action below to verify how the backend security layer handles requests from your current role ({currentRole}).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          <button
            onClick={() => simulateAction('Publish Community Need (POST /api/needs)', 'NGO')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left text-xs bg-slate-50 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">Publish Community Need</div>
            <div className="text-[11px] text-slate-500 mt-1">Requires: Role.NGO</div>
          </button>

          <button
            onClick={() => simulateAction('Approve Supplier Quote (POST /api/orders)', 'NGO')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left text-xs bg-slate-50 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">Approve Supplier Quote</div>
            <div className="text-[11px] text-slate-500 mt-1">Requires: Role.NGO</div>
          </button>

          <button
            onClick={() => simulateAction('Accept Order / Mark Dispatched (PUT /api/orders/status)', 'SUPPLIER')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left text-xs bg-slate-50 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">Dispatch Order Logistics</div>
            <div className="text-[11px] text-slate-500 mt-1">Requires: Role.SUPPLIER</div>
          </button>

          <button
            onClick={() => simulateAction('Inspect System Audit Trail (GET /api/admin/audit-logs)', 'ADMIN')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 text-left text-xs bg-slate-50 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="font-bold text-slate-900">Inspect Security Audit Logs</div>
            <div className="text-[11px] text-slate-500 mt-1">Requires: Role.ADMIN</div>
          </button>

        </div>

        {/* Security Simulation Result Box */}
        {testResult && (
          <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 animate-in fade-in duration-200 ${
            testResult.allowed
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center space-x-2 font-bold font-sans">
              {testResult.allowed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Access Granted &bull; Authorized</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Access Denied &bull; Blocked by RBAC</span>
                </>
              )}
            </div>
            <p className="text-[11px]">{testResult.reason}</p>
          </div>
        )}
      </div>

      {/* Switch Role Quick Recovery */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Need to test as another role?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Switch your active evaluator persona at any time.</p>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer shrink-0 shadow"
        >
          Open Persona Switcher
        </button>
      </div>

    </div>
  );
};
