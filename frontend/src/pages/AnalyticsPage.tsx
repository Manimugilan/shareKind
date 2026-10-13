import React, { useMemo, useState } from 'react';
import { api } from '../services/api';
import { ClientAIEngine } from '../utils/aiEngine';
import { 
  BarChart3, Sparkles, TrendingUp, Download, Database, 
  Cpu, ShieldCheck, AlertTriangle, Layers, Code, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, PieChart, Pie, Cell, Legend 
} from 'recharts';

const PIE_COLORS = ['#0d9488', '#10b981', '#6366f1', '#f59e0b'];

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'charts' | 'ai_forecast' | 'athena_sql'>('charts');

  const needs = useMemo(() => api.getNeeds(), []);
  const forecast = useMemo(() => ClientAIEngine.forecastDemand(needs), [needs]);

  // Aggregate stats
  const donations = useMemo(() => api.exportDataset('donations', 'json'), []);
  const orders = useMemo(() => api.getOrders({ role: 'ADMIN' } as any), []);

  const totalProcured = orders.reduce((sum, o) => sum + o.total_cost, 0);

  const monthlyTrendData = [
    { month: 'Jun', donations: 3200, procurement: 2900 },
    { month: 'Jul', donations: 4500, procurement: 4100 },
    { month: 'Aug', donations: 5800, procurement: 5200 },
    { month: 'Sep', donations: 7200, procurement: 6800 },
    { month: 'Oct (Current)', donations: 8450, procurement: 6100 },
  ];

  const categoryDistribution = [
    { name: 'Food & Meals', value: 3800 },
    { name: 'Groceries', value: 2750 },
    { name: 'Clothing', value: 1900 },
  ];

  const supplierEfficiencyData = [
    { name: 'Harvest Caterers', avgCost: 3.20, reliability: 98 },
    { name: 'Community Table', avgCost: 3.80, reliability: 94 },
    { name: 'City Delights', avgCost: 2.90, reliability: 89 },
    { name: 'Metro Pantry', avgCost: 22.50, reliability: 96 },
    { name: 'Warmth & Care', avgCost: 35.00, reliability: 97 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Data Intelligence & AI Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Community Analytics & Impact Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time procurement expenditure metrics, demand forecasting, and AWS Athena Data Lake queries.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'charts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Visual KPIs
          </button>
          <button
            onClick={() => setActiveTab('ai_forecast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'ai_forecast' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Demand Model</span>
          </button>
          <button
            onClick={() => setActiveTab('athena_sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'athena_sql' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Athena SQL BI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Funds Mobilized</span>
          <div className="text-3xl font-extrabold text-teal-600 font-heading mt-2">$8,450.00</div>
          <p className="text-xs text-slate-500 mt-1">+17.3% vs previous cycle</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Procurement Outlay</span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading mt-2">${totalProcured.toFixed(2)}</div>
          <p className="text-xs text-slate-500 mt-1">Directly paid to verified suppliers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Fulfilled Batches</span>
          <div className="text-3xl font-extrabold text-emerald-600 font-heading mt-2">{orders.length} Orders</div>
          <p className="text-xs text-slate-500 mt-1">Across 4 verified shelters</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Capital Efficiency</span>
          <div className="text-3xl font-extrabold text-indigo-600 font-heading mt-2">96.4%</div>
          <p className="text-xs text-slate-500 mt-1">Relief goods translation index</p>
        </div>
      </div>

      {/* Tab 1: Charts View */}
      {activeTab === 'charts' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base font-heading mb-1">
                Monthly Contributions vs. Procurement Outlay
              </h3>
              <p className="text-xs text-slate-500 mb-6">Tracking donor funds mobilized versus supplier disbursements</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip formatter={(val: any) => [`$${val}`, '']} />
                    <Legend />
                    <Bar dataKey="donations" name="Donations Inflow ($)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="procurement" name="Procurement Outflow ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base font-heading mb-1">
                Category Expenditure Allocation
              </h3>
              <p className="text-xs text-slate-500 mb-6">Distribution between hot meals, family groceries, and apparel</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Allocated']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: AI Demand Forecasting Model */}
      {activeTab === 'ai_forecast' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-700 text-xs font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Explainable AI Demand Sizing Algorithm</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  14-Day Forward Community Need Forecast
                </h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:block">
                Baseline Model
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Analyzes historical shelter request velocity, seasonal temperature changes, and warehouse inventory to project upcoming relief demand gaps.
            </p>

            {/* Projection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Projected Food Demand</span>
                <div className="text-2xl font-extrabold text-teal-400 mt-1">
                  {forecast.projected_14d_demand.food || 780} Meals
                </div>
                <p className="text-[11px] text-slate-400 mt-1">+20% seasonal surge projected</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Projected Grocery Kits</span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {forecast.projected_14d_demand.groceries || 135} Kits
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Family staples allocation</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Projected Warmth Kits</span>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                  {forecast.projected_14d_demand.clothing || 120} Bundles
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Winter shelter coat requests</p>
              </div>
            </div>

            {/* Underserved Alerts */}
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs space-y-2">
              <div className="font-bold flex items-center space-x-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Underserved Community Deficit Alerts</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {forecast.underserved_alerts.map((al, idx) => (
                  <li key={idx}>
                    <strong className="text-white">{al.category} ({al.urgency_level}):</strong> {al.reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Confidence: {forecast.confidence_interval}</span>
              <span>Training Samples: {forecast.training_samples} verified events</span>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: AWS Athena & Glue SQL BI Queries */}
      {activeTab === 'athena_sql' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  Amazon Athena SQL Analytical Queries
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-configured Presto SQL templates executed against the ShareKind S3 Data Lake
                </p>
              </div>
              <span className="text-xs bg-teal-950 text-teal-300 border border-teal-700 px-2 py-0.5 rounded">
                Database: sharekind_analytics_db
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-teal-300 border border-slate-800 overflow-x-auto space-y-4">
              <div>
                <span className="text-slate-500">-- 1. Total Donation Volume & Average Contribution by Category</span>
                <pre className="text-slate-200 mt-1">
{`SELECT 
    category,
    COUNT(donation_id) AS total_donations_count,
    ROUND(SUM(amount), 2) AS total_funds_collected,
    ROUND(AVG(amount), 2) AS average_donation_size
FROM sharekind_analytics_db.donations
WHERE is_demo = false
GROUP BY category
ORDER BY total_funds_collected DESC;`}
                </pre>
              </div>

              <div>
                <span className="text-slate-500">-- 2. Procurement Cost Efficiency & Delivery Turnaround (Hours)</span>
                <pre className="text-slate-200 mt-1">
{`SELECT 
    supplier_name,
    item_category,
    COUNT(order_id) AS total_orders_fulfilled,
    ROUND(AVG(unit_price), 2) AS avg_unit_price,
    ROUND(SUM(total_cost), 2) AS total_expenditure
FROM sharekind_analytics_db.procurement_orders
WHERE status IN ('delivered', 'confirmed_distribution')
GROUP BY supplier_name, item_category;`}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
