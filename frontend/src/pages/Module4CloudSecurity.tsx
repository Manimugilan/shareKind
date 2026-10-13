import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Shield, Key, Lock, Unlock, Network, AlertOctagon, 
  CheckCircle2, AlertTriangle, Eye, RefreshCw, FileText, Server
} from 'lucide-react';

export const Module4CloudSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kms' | 'iam' | 'vpc' | 'threats'>('kms');

  // KMS Envelope Encryption State
  const [plaintextInput, setPlaintextInput] = useState<string>('Donor Card: 4111-2222-3333-4444 (Exp: 10/28, CVV: 719)');
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [encryptionResult, setEncryptionResult] = useState<any>(null);
  const [decryptionResult, setDecryptionResult] = useState<any>(null);

  // IAM Policy Evaluator State
  const [evalRole, setEvalRole] = useState<string>('DONOR');
  const [evalAction, setEvalAction] = useState<string>('sharekind:VerifyPartner');
  const [evalResult, setEvalResult] = useState<any>(null);
  const [iamPolicies, setIamPolicies] = useState<any>(null);
  const [showPolicyJson, setShowPolicyJson] = useState<boolean>(false);

  // VPC Topology State
  const [vpcData, setVpcData] = useState<any>(null);

  // CloudTrail & Threat State
  const [cloudTrailEvents, setCloudTrailEvents] = useState<any[]>([]);
  const [threatAlerts, setThreatAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const policies = await api.getIamPolicies();
    setIamPolicies(policies);

    const vpc = await api.getVpcTopology();
    setVpcData(vpc);

    const trail = await api.getCloudTrailEvents();
    if (trail?.events) setCloudTrailEvents(trail.events);

    const threats = await api.getThreatAlerts();
    if (threats?.threats) setThreatAlerts(threats.threats);

    // Initial IAM eval
    handleEvaluateIam('DONOR', 'sharekind:VerifyPartner');
  };

  const handleKmsEncrypt = async () => {
    setIsEncrypting(true);
    setDecryptionResult(null);
    const res = await api.kmsEncrypt(plaintextInput);
    setEncryptionResult(res);
    setIsEncrypting(false);
  };

  const handleKmsDecrypt = async () => {
    if (!encryptionResult) return;
    setIsDecrypting(true);
    const res = await api.kmsDecrypt({
      encrypted_data_key_hex: encryptionResult.encrypted_data_key_hex,
      ciphertext_base64: encryptionResult.ciphertext_base64,
      initialization_vector_hex: encryptionResult.initialization_vector_hex,
      auth_tag_hex: encryptionResult.auth_tag_hex
    });
    setDecryptionResult(res);
    setIsDecrypting(false);
  };

  const handleEvaluateIam = async (role: string, action: string) => {
    setEvalRole(role);
    setEvalAction(action);
    const res = await api.evaluateIamPolicy(role, action);
    setEvalResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-red-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Shield className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Wipro CPPE · Module 4
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Zero-Trust Security & Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Cloud Security, Cryptography & Governance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Multi-layered cloud governance incorporating AWS KMS envelope encryption (AES-256-GCM), 
            granular least-privilege AWS IAM policies, isolated multi-AZ Amazon VPC subnets, AWS CloudTrail audit logging, and automated threat detection.
          </p>

          {/* Subtopic Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['AWS IAM', 'Amazon VPC', 'Envelope Encryption', 'AWS KMS', 'AWS CloudTrail', 'CloudWatch', 'Threat Detection'].map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/80 text-rose-200 px-3 py-1 rounded-lg border border-rose-500/30">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('kms')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'kms'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>AWS KMS Envelope Encryption</span>
        </button>

        <button
          onClick={() => setActiveTab('iam')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'iam'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>AWS IAM Least-Privilege Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('vpc')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'vpc'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Amazon VPC Multi-AZ Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('threats')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'threats'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>CloudTrail & Threat Detection</span>
        </button>
      </div>

      {/* TAB 1: AWS KMS ENVELOPE ENCRYPTION */}
      {activeTab === 'kms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Encryption Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-rose-600" />
                <span>Envelope Encryption with AWS KMS (CMK)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Data is encrypted using a unique 256-bit plaintext data key (PDK). The PDK is encrypted under the KMS Customer Master Key (CMK) and discarded from memory.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700">Sensitive Plaintext Input (PII / Card Token)</label>
                <textarea
                  value={plaintextInput}
                  onChange={(e) => setPlaintextInput(e.target.value)}
                  rows={3}
                  className="w-full mt-1 p-3 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <button
                onClick={handleKmsEncrypt}
                disabled={isEncrypting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-60"
              >
                {isEncrypting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Encrypt with KMS CMK (AES-256-GCM)</span>
              </button>

              {encryptionResult && (
                <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-800">
                  <div className="flex justify-between text-[11px] text-rose-400 font-mono">
                    <span>Algorithm: {encryptionResult.algorithm}</span>
                    <span>Bytes: {encryptionResult.plaintext_length_bytes}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Ciphertext (Base64)</span>
                    <p className="font-mono text-emerald-300 break-all text-[11px]">{encryptionResult.ciphertext_base64}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">KMS Encrypted Data Key (EDK Hex)</span>
                    <p className="font-mono text-slate-300 break-all text-[10px]">{encryptionResult.encrypted_data_key_hex}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Decryption Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <Unlock className="w-5 h-5 text-emerald-600" />
                <span>KMS Decryption & Auth Tag Integrity Check</span>
              </h3>
              <p className="text-xs text-slate-500">
                AWS KMS decrypts the Encrypted Data Key using the Master Key, then verifies the 128-bit authentication tag before recovering the plaintext.
              </p>

              <button
                onClick={handleKmsDecrypt}
                disabled={!encryptionResult || isDecrypting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                {isDecrypting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                <span>Decrypt with AWS KMS</span>
              </button>

              {decryptionResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Verification Succeeded</span>
                  </div>
                  <div className="p-2.5 bg-white border border-emerald-200 rounded-lg text-slate-900 font-mono text-xs">
                    {decryptionResult.decrypted_plaintext}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Master Key ARN: <span className="font-mono">{decryptionResult.kms_cmk_arn}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AWS IAM LEAST-PRIVILEGE EVALUATOR */}
      {activeTab === 'iam' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-rose-600" />
                <span>AWS IAM Policy Evaluator & Least-Privilege Boundaries</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tests authorization boundaries across DONOR, NGO, SUPPLIER, and ADMIN policies. Verifies immediate HTTP 403 / Explicit Deny on unauthorized actions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Select IAM Role Persona</label>
                <select
                  value={evalRole}
                  onChange={(e) => handleEvaluateIam(e.target.value, evalAction)}
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-xs outline-none"
                >
                  <option value="DONOR">DONOR (Sarah Jenkins - Strict Isolation)</option>
                  <option value="NGO">NGO (Hope Haven - Needs & Procurement)</option>
                  <option value="SUPPLIER">SUPPLIER (Harvest Caterers - Fulfillment)</option>
                  <option value="ADMIN">ADMIN (Compliance - Accreditation & Audit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Select API Action to Test</label>
                <select
                  value={evalAction}
                  onChange={(e) => handleEvaluateIam(evalRole, e.target.value)}
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-xs outline-none"
                >
                  <option value="sharekind:CreateDonation">sharekind:CreateDonation</option>
                  <option value="sharekind:PublishNeed">sharekind:PublishNeed</option>
                  <option value="sharekind:ApproveProcurementOrder">sharekind:ApproveProcurementOrder</option>
                  <option value="sharekind:VerifyPartner">sharekind:VerifyPartner (Admin Only)</option>
                  <option value="sharekind:ReadAuditLogs">sharekind:ReadAuditLogs (Admin Only)</option>
                  <option value="sharekind:ReadDonorPII">sharekind:ReadDonorPII (Denied to NGOs)</option>
                </select>
              </div>
            </div>

            {/* Evaluation Result Banner */}
            {evalResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                evalResult.decision === 'ALLOW'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>IAM Policy Decision: {evalResult.decision}</span>
                  <span className="font-mono text-[11px]">{evalResult.policy_name}</span>
                </div>
                <p className="text-slate-700">{evalResult.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AMAZON VPC MULTI-AZ TOPOLOGY */}
      {activeTab === 'vpc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Network className="w-5 h-5 text-indigo-600" />
                  <span>Amazon VPC Network Topology (Multi-AZ Architecture)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">VPC ID: <span className="font-mono font-semibold text-slate-700">vpc-089c42b10e9f1a23</span> · CIDR: <span className="font-mono text-indigo-700 font-semibold">10.0.0.0/16</span> (us-east-1)</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-semibold">
                6 Subnets Across 2 AZs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Public Subnets */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  PUBLIC DMZ SUB-TIER
                </span>
                <p className="text-xs text-slate-700 font-semibold">10.0.1.0/24 (us-east-1a) & 10.0.2.0/24 (us-east-1b)</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Internet Gateway (igw-081f)</li>
                  <li>• Managed NAT Gateway</li>
                  <li>• NGINX Reverse SSL Proxy</li>
                  <li>• S3 Website Hosting Gateway</li>
                </ul>
              </div>

              {/* Private App Subnets */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  PRIVATE COMPUTE SUB-TIER
                </span>
                <p className="text-xs text-slate-700 font-semibold">10.0.10.0/24 (us-east-1a) & 10.0.20.0/24 (us-east-1b)</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Amazon EC2 Backend Instance (i-0ecab39181055eace)</li>
                  <li>• AWS Lambda Elastic Network Interfaces (ENIs)</li>
                  <li>• Outbound access via NAT Gateway only</li>
                </ul>
              </div>

              {/* Isolated Data Subnets */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                  ISOLATED DATA & DWH SUB-TIER
                </span>
                <p className="text-xs text-slate-700 font-semibold">10.0.100.0/24 (us-east-1a) & 10.0.200.0/24 (us-east-1b)</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Amazon DynamoDB Gateway VPC Endpoint</li>
                  <li>• Amazon S3 Gateway VPC Endpoint</li>
                  <li>• Amazon Redshift Columnar DWH Cluster</li>
                  <li>• Zero Public Ingress Routes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLOUDTRAIL & THREAT DETECTION */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          {/* Threat Detection Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              <span>Amazon GuardDuty Threat Findings</span>
            </h3>

            <div className="space-y-3">
              {threatAlerts.map((finding) => (
                <div key={finding.finding_id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{finding.title}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-red-100 text-red-800">
                      SEVERITY: {finding.severity} ({finding.severity_score}/10)
                    </span>
                  </div>
                  <p className="text-slate-700">{finding.description}</p>
                  <div className="pt-2 border-t border-red-200 text-slate-600 flex items-center justify-between">
                    <span>Remediation: {finding.remediation}</span>
                    <span className="font-bold text-emerald-700">{finding.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CloudTrail Event Stream */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>AWS CloudTrail Immutable Audit Ledger</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-3 px-4">Event Name</th>
                    <th className="py-3 px-4">AWS Service</th>
                    <th className="py-3 px-4">Actor Identity</th>
                    <th className="py-3 px-4">Source IP</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {cloudTrailEvents.map((evt) => (
                    <tr key={evt.event_id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{evt.event_name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{evt.event_source}</td>
                      <td className="py-3 px-4">{evt.user_identity?.user}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{evt.source_ip}</td>
                      <td className="py-3 px-4 text-slate-500">{evt.event_time}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
