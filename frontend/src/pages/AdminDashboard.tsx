import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { AuditLog, Supplier, User } from '../types';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, 
  Search, Download, Database, Lock, Clock, UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try { return api.getAuditLogs(currentUser); } catch { return []; }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => api.getSuppliers());
  const [users, setUsers] = useState<User[]>(() => api.getUsers());
  const [searchQuery, setSearchQuery] = useState('');

  // Unverified lists
  const unverifiedSuppliers = useMemo(() => suppliers.filter(s => !s.verified), [suppliers]);
  const unverifiedNgos = useMemo(() => users.filter(u => u.role === 'NGO' && !u.verified), [users]);

  const handleVerify = (type: 'supplier' | 'ngo', id: string, name: string) => {
    try {
      api.verifyEntity(currentUser, type, id, true);
      setSuppliers([...api.getSuppliers()]);
      setUsers([...api.getUsers()]);
      setAuditLogs(api.getAuditLogs(currentUser));
      showToast(`${name} verified and accredited successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    }
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return auditLogs;
    const q = searchQuery.toLowerCase();
    return auditLogs.filter(l => 
      l.action.toLowerCase().includes(q) || 
      l.resource_id.toLowerCase().includes(q) ||
      l.user_role.toLowerCase().includes(q)
    );
  }, [auditLogs, searchQuery]);

  // Export Data Lake
  const handleExportDataLake = (format: 'csv' | 'json') => {
    const data = api.exportDataset('donations', format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sharekind_datalake_donations.${format}`;
    a.click();
    showToast(`Exported S3 Data Lake dataset in ${format.toUpperCase()} format!`, 'success');
  };

  if (currentRole !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Administrative Authorization Required
        </h2>
        <p className="text-xs text-slate-600">
          This governance dashboard is restricted to authorized platform compliance auditors (Role.ADMIN).
        </p>
        <div className="p-3 bg-rose-50 rounded-xl text-rose-900 text-xs font-mono">
          Security policy: RBAC verification failed for active role: {currentRole}.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Governance & Audit Portal &mdash; {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Admin Verification & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review organization verification requests, monitor system audit logs, and trigger Amazon S3 analytics exports.
          </p>
        </div>

        {/* Data Lake Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExportDataLake('csv')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExportDataLake('json')}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow"
          >
            <Database className="w-3.5 h-3.5" />
            <span>S3 JSON Lake</span>
          </button>
        </div>
      </div>

      {/* Pending Accreditation Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Unverified NGOs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Pending NGO Verifications ({unverifiedNgos.length})
            </h3>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Requires Review
            </span>
          </div>

          <div className="space-y-3">
            {unverifiedNgos.map((ngo) => (
              <div key={ngo.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{ngo.name}</h4>
                  <p className="text-[11px] text-slate-500">{ngo.email} &bull; {ngo.location}</p>
                </div>
                <button
                  onClick={() => handleVerify('ngo', ngo.id, ngo.name)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  Verify NGO
                </button>
              </div>
            ))}

            {unverifiedNgos.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                All community shelters and NGOs are accredited.
              </div>
            )}
          </div>
        </div>

        {/* Unverified Suppliers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Pending Supplier Licenses ({unverifiedSuppliers.length})
            </h3>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Food Safety / Trade Check
            </span>
          </div>

          <div className="space-y-3">
            {unverifiedSuppliers.map((sup) => (
              <div key={sup.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{sup.name}</h4>
                  <p className="text-[11px] text-slate-500 capitalize">{sup.category} &bull; Area: {sup.service_area}</p>
                </div>
                <button
                  onClick={() => handleVerify('supplier', sup.id, sup.name)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  Verify License
                </button>
              </div>
            ))}

            {unverifiedSuppliers.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                All marketplace suppliers are verified.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Real-Time Immutable Audit Log Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Immutable Platform Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Audit logs capture every donation, quote approval, status transition, and verification action.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search action or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Actor Role</th>
                <th className="py-2.5 px-3">Resource Ref</th>
                <th className="py-2.5 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{log.audit_id}</td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3 font-bold text-teal-800">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-sans text-[10px] font-bold">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{log.resource_id}</td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
