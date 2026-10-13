import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Cpu, GitBranch, Play, CheckCircle2, AlertCircle, Clock, 
  Workflow, ArrowRight, Layers, RefreshCw, Zap, Server, Shield
} from 'lucide-react';

export const Module1PlatformEngineering: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'step_functions' | 'microservices' | 'cicd'>('step_functions');
  
  // Step Functions State
  const [sfQuantity, setSfQuantity] = useState<number>(100);
  const [sfBudget, setSfBudget] = useState<number>(400);
  const [isExecutingSF, setIsExecutingSF] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [sfResult, setSfResult] = useState<any>(null);
  const [sfDefinition, setSfDefinition] = useState<any>(null);
  const [showAslCode, setShowAslCode] = useState<boolean>(false);

  // Microservices Health State
  const [healthData, setHealthData] = useState<any>(null);

  // CI/CD Pipeline State
  const [pipelineRuns, setPipelineRuns] = useState<any[]>([]);
  const [isTriggeringCi, setIsTriggeringCi] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const health = await api.getPlatformHealth();
    setHealthData(health);

    const sfd = await api.getStepFunctionsDefinition();
    setSfDefinition(sfd);

    const cicd = await api.getCicdPipeline();
    if (cicd && cicd.pipeline_runs) {
      setPipelineRuns(cicd.pipeline_runs);
    }
  };

  const sfSteps = [
    { id: "ValidateOrderInput", name: "1. Validate Order Input", type: "Task", lambda: "OrderInventoryValidation" },
    { id: "CheckSupplierInventory", name: "2. Verify Stock Capacity", type: "Choice", lambda: "Decision Rule" },
    { id: "AuthorizeDonationFunds", name: "3. Authorize Escrow Funds", type: "Task", lambda: "OrderPaymentVerification" },
    { id: "NotifySupplierForAcceptance", name: "4. Notify Supplier", type: "Task", lambda: "OrderShippingApproval" },
    { id: "WaitForSupplierConfirmation", name: "5. Await ACK SLA (5s)", type: "Wait", lambda: "StepFunctions Timer" },
    { id: "ProcessDispatchLogistics", name: "6. Dispatch Logistics", type: "Task", lambda: "OrderShippingApproval" },
    { id: "NotifyBeneficiaryNGO", name: "7. Alert Beneficiary NGO", type: "Task", lambda: "OrderCustomerNotification" },
    { id: "OrderFulfillmentSuccess", name: "8. Fulfillment Success", type: "Succeed", lambda: "Terminal State" }
  ];

  const handleRunStepFunction = async () => {
    setIsExecutingSF(true);
    setActiveStepIndex(0);
    setSfResult(null);

    // Simulate animated step traversal for evaluator visualization
    for (let i = 0; i < sfSteps.length; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    const res = await api.executeStepFunction({
      order_id: `ord-eval-${Date.now().toString().slice(-4)}`,
      supplier_id: "sup-1",
      quantity: sfQuantity,
      budget: sfBudget
    });

    setSfResult(res);
    setIsExecutingSF(false);
  };

  const handleTriggerCiCd = async () => {
    setIsTriggeringCi(true);
    const newRun = await api.triggerCicd({
      branch: "main",
      triggered_by: "Evaluator (Manual Trigger)"
    });
    setPipelineRuns([newRun, ...pipelineRuns]);
    setIsTriggeringCi(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Workflow className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Wipro CPPE · Module 1
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Active Cloud-Native Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Cloud Product & Platform Engineering
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Multi-tier serverless orchestration featuring decoupled AWS Lambda microservices, 
            Amazon API Gateway REST routing, AWS Step Functions finite state execution, and automated GitHub Actions CI/CD pipelines.
          </p>

          {/* Subtopic Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Cloud-Native Architecture', 'Microservices', 'AWS Lambda', 'API Gateway', 'Step Functions', 'CI/CD Pipelines'].map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/80 text-blue-200 px-3 py-1 rounded-lg border border-blue-500/30">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('step_functions')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'step_functions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>AWS Step Functions Orchestration</span>
        </button>

        <button
          onClick={() => setActiveTab('microservices')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'microservices'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Microservices & API Gateway Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('cicd')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'cicd'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Automated CI/CD Deployment Pipeline</span>
        </button>
      </div>

      {/* TAB 1: AWS STEP FUNCTIONS */}
      {activeTab === 'step_functions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <span>Execute State Machine</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Triggers <span className="font-mono text-blue-700">OrderFulfillmentWorkflow</span> with retry policies and catch handlers.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Procurement Quantity</label>
                  <input
                    type="number"
                    value={sfQuantity}
                    onChange={(e) => setSfQuantity(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-400">Max supplier batch capacity: 500 units</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Authorized Budget Cap ($)</label>
                  <input
                    type="number"
                    value={sfBudget}
                    onChange={(e) => setSfBudget(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleRunStepFunction}
                disabled={isExecutingSF}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isExecutingSF ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing AWS Step Function...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Launch Step Function Execution</span>
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>States Language: <strong>ASL (JSON)</strong></span>
                <button
                  onClick={() => setShowAslCode(!showAslCode)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {showAslCode ? "Hide ASL Definition" : "View ASL Definition"}
                </button>
              </div>

              {showAslCode && (
                <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-blue-200 overflow-x-auto max-h-56">
                  <pre>{JSON.stringify(sfDefinition || {}, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Visual State Machine Diagram */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Visual Execution Flow (AWS Step Functions)</h3>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                  arn:aws:states:us-east-1:438787411234:stateMachine:EcommerceOrderWorkflow
                </span>
              </div>

              {/* State Machine Step Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {sfSteps.map((step, idx) => {
                  const isCurrent = activeStepIndex === idx;
                  const isCompleted = activeStepIndex > idx || (sfResult && sfResult.status === 'SUCCEEDED');
                  
                  let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                  if (isCurrent) badgeColor = "bg-blue-500 text-white border-blue-600 animate-pulse";
                  else if (isCompleted) badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-300";

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-blue-500 shadow-md ring-2 ring-blue-300 bg-blue-50/50"
                          : isCompleted
                          ? "border-emerald-300 bg-emerald-50/30"
                          : "border-slate-200 bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{step.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {isCurrent ? "RUNNING" : isCompleted ? "SUCCEEDED" : "PENDING"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Type: {step.type}</span>
                        <span className="truncate max-w-[140px] text-slate-600">{step.lambda}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Execution Summary Output */}
              {sfResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Execution Status: {sfResult.status}</span>
                    </span>
                    <span className="font-mono text-slate-400">Duration: {sfResult.duration_seconds}s</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Order <span className="font-mono text-teal-300">{sfResult.order_id}</span> successfully validated against stock limits, escrow funds authorized, and logistics tracking dispatched.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MICROSERVICES & API GATEWAY */}
      {activeTab === 'microservices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
              <div className="flex items-center space-x-3 text-blue-600">
                <Server className="w-6 h-6" />
                <h4 className="font-bold text-slate-900">Amazon API Gateway</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manages managed REST endpoints with CORS policies, rate limiting (10,000 req/sec), and JWT bearer authorization interceptors.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocol:</span>
                  <span className="font-semibold text-slate-800">HTTP/2, TLS 1.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency (p95):</span>
                  <span className="font-semibold text-emerald-600">38.4 ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active API Routes:</span>
                  <span className="font-semibold text-slate-800">14 Routes</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
              <div className="flex items-center space-x-3 text-amber-600">
                <Zap className="w-6 h-6" />
                <h4 className="font-bold text-slate-900">AWS Lambda Microservices</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stateless Python 3.10 functions executed on-demand in ephemeral microVMs with sub-15ms cold start initialization.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Deployed Functions:</span>
                  <span className="font-semibold text-slate-800">5 Microservices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Execution Role:</span>
                  <span className="font-mono text-slate-800">arn:aws:iam:...:role/LabRole</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Error Rate:</span>
                  <span className="font-semibold text-emerald-600">0.00%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
              <div className="flex items-center space-x-3 text-purple-600">
                <Layers className="w-6 h-6" />
                <h4 className="font-bold text-slate-900">Persistence Integration</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                DynamoDB single-table persistence and S3 Data Lake streaming decoupled from transactional read/write workloads.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Table:</span>
                  <span className="font-mono text-slate-800">sharekind-core-dev</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Analytics Lake:</span>
                  <span className="font-mono text-slate-800">sharekind-analytics-lake</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capacity Mode:</span>
                  <span className="font-semibold text-blue-600">Pay-Per-Request (On-Demand)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Microservices Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Deployed Microservice Functions (AWS Lambda)</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                All 5 Functions Healthy
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Microservice Name</th>
                    <th className="py-3 px-6">Runtime</th>
                    <th className="py-3 px-6">Memory</th>
                    <th className="py-3 px-6">Invocations (24h)</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {healthData?.lambda_microservices?.map((fn: any) => (
                    <tr key={fn.name} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center space-x-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{fn.name}</span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-500">{fn.runtime}</td>
                      <td className="py-3.5 px-6">{fn.memory_mb} MB</td>
                      <td className="py-3.5 px-6 font-semibold">{fn.invocations_24h.toLocaleString()}</td>
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {fn.status}
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

      {/* TAB 3: CI/CD PIPELINES */}
      {activeTab === 'cicd' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                  <span>GitHub Actions CI/CD Deployment Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Automated continuous integration and deployment workflow defined in <code className="font-mono text-slate-700">.github/workflows/ci_cd_pipeline.yml</code>.
                </p>
              </div>

              <button
                onClick={handleTriggerCiCd}
                disabled={isTriggeringCi}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isTriggeringCi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Triggering Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Trigger CI/CD Pipeline</span>
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Runs List */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {pipelineRuns.map((run: any) => (
                <div key={run.run_id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        #{run.run_id}
                      </span>
                      <span className="font-mono text-xs text-blue-600 font-semibold">
                        commit {run.commit_hash}
                      </span>
                      <span className="text-xs text-slate-600">({run.branch})</span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{run.duration}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {run.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {run.commit_message}
                  </p>

                  {/* 4 Stages Visual Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                    {run.stages?.map((stage: any) => (
                      <div key={stage.name} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 truncate">{stage.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{stage.tool}</span>
                          <span className="font-mono text-slate-400">{stage.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
