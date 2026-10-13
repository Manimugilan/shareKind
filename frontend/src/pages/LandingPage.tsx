import React from 'react';
import { 
  HeartHandshake, ShieldCheck, Cpu, ArrowRight, Utensils, 
  ShoppingBag, Shirt, Sparkles, Building2, CheckCircle2, 
  ExternalLink, BarChart, Lock, Users
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Donation & Transparent Procurement Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white font-heading">
              Every Contribution, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                Verified from Donor to Distribution.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              ShareKind connects generous donors directly with verified orphanages, shelters, and community kitchens.
              Our platform uses explainable AI to compare local suppliers and guarantees transparent procurement with private donor dashboards.
            </p>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('make-donation')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm sm:text-base hover:from-teal-400 hover:to-emerald-400 transition shadow-lg shadow-teal-500/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>Make a Donation Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('supplier-marketplace')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Compare Local Suppliers</span>
              </button>

              <button
                onClick={() => onNavigate('donor-dashboard')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-teal-300 font-semibold text-sm sm:text-base border border-teal-700/50 transition flex items-center space-x-2 cursor-pointer"
              >
                <span>View Private Donor Impact</span>
              </button>
            </div>

            {/* Architecture Assurance */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero Public Leaderboards (100% Private Data)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explainable AI Supplier Selection</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Strict RBAC Security & Verification</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Community Impact Statistics Bar */}
      <section className="bg-slate-900 border-y border-slate-800 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">$8,450.00</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Community Funds Mobilized</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-heading">2,410+</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Nutritious Hot Meals Funded</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-heading">4 Verified</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Shelters & Orphanages</p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-heading">10 Vetted</div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Local Food & Grocery Suppliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wipro CPPE Modules Showcase Grid */}
      <section className="py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              Wipro CPPE Final Evaluation Modules
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-3">
              Full-Stack Cloud & AI Engineering Suite
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Explore the four core engineering modules implemented for evaluation, complete with live cloud services, PySpark pipelines, foundation models, and cryptographic zero-trust boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Cloud Product & Platform Engineering
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cloud-native serverless architecture, decoupled AWS Lambda microservices, Amazon API Gateway, AWS Step Functions finite state execution, and automated GitHub Actions CI/CD.
                </p>
              </div>
              <button
                onClick={() => onNavigate('module1-platform')}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Explore Module 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Data Engineering, Big Data & ML Insights
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enterprise S3 Data Lake, Apache Spark (PySpark) windowed ETL transformations, AWS Glue Data Catalog, Amazon Redshift Star Schema DWH, and ML demand forecasting.
                </p>
              </div>
              <button
                onClick={() => onNavigate('module2-bigdata')}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Explore Module 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Generative AI, Foundation Models & RAG
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Retrieval-Augmented Generation (RAG) with vector embeddings and citations, multi-template Prompt Engineering Studio, and autonomous multi-step ReAct AI agents.
                </p>
              </div>
              <button
                onClick={() => onNavigate('module3-genai')}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Explore Module 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Cloud Security, Cryptography & Governance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AWS KMS envelope encryption (AES-256-GCM), least-privilege IAM policy evaluations, multi-AZ VPC topology, CloudTrail audit ledgers, and GuardDuty threat detection.
                </p>
              </div>
              <button
                onClick={() => onNavigate('module4-security')}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Explore Module 4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">Direct Essential Support</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
              Transparent Donation Categories
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Donors fund specific, verified physical needs instead of vague monetary pools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Food */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:shadow-xl transition-all duration-300 group hover:border-teal-500">
              <div className="w-14 h-14 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Nutritious Prepared Meals</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Connects soup kitchens and homeless shelters with local diners and caterers for balanced, hot meals at bulk rates.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Benchmark: $3.20 - $3.80 / meal</span>
                <button onClick={() => onNavigate('make-donation')} className="text-teal-600 font-bold hover:underline cursor-pointer">
                  Donate Meals &rarr;
                </button>
              </div>
            </div>

            {/* Groceries */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:shadow-xl transition-all duration-300 group hover:border-teal-500">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Family Grocery Packages</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Procures rice, grains, pulses, oil, and nutrition supplements directly from regional wholesale food markets.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Benchmark: $22.50 / week supply</span>
                <button onClick={() => onNavigate('make-donation')} className="text-teal-600 font-bold hover:underline cursor-pointer">
                  Donate Groceries &rarr;
                </button>
              </div>
            </div>

            {/* Clothing */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:shadow-xl transition-all duration-300 group hover:border-teal-500">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shirt className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Clothing & Warmth Kits</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Supplies thermal jackets, children's clothes, and blankets from garment dealers for winter shelter relief.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Benchmark: $35.00 / winter kit</span>
                <button onClick={() => onNavigate('make-donation')} className="text-teal-600 font-bold hover:underline cursor-pointer">
                  Donate Clothing &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Workflow */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-400 font-bold text-xs uppercase tracking-wider">End-to-End Integrity</span>
            <h2 className="text-3xl font-extrabold text-white font-heading mt-2">
              The 4-Step Verified Workflow
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              How ShareKind ensures every rupee or dollar translates directly into physical relief goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">Donor Contributes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Donor selects food, groceries, or clothing. Receives private dashboard tracking and verified impact metrics.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">NGO Publishes Need</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verified community shelter submits requirement with quantity, target date, location, and budget constraints.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">AI Ranks Suppliers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algorithm calculates total cost (unit price &times; qty + delivery fee), stock capacity, speed, and trust scores.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-white mb-2">Verified Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supplier fulfills, carrier delivers, and NGO verifies distribution. Audit logs record every milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluator Quick Role Access Section */}
      <section className="py-16 bg-teal-900 text-white border-t border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Ready to Evaluate ShareKind?
          </h2>
          <p className="text-teal-200 text-sm mt-2 max-w-xl mx-auto">
            Test the complete workflow with pre-configured demo personas or review the cloud analytics pipeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('donor-dashboard')}
              className="px-5 py-2.5 rounded-lg bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition shadow cursor-pointer"
            >
              Test as Donor (Sarah Jenkins)
            </button>
            <button
              onClick={() => onNavigate('ngo-dashboard')}
              className="px-5 py-2.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-semibold text-sm border border-teal-600 transition cursor-pointer"
            >
              Test as NGO (Hope Haven)
            </button>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-teal-300 font-semibold text-sm border border-slate-800 transition cursor-pointer"
            >
              Test as Admin (Auditor)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">ShareKind Platform</span>
            <span>&mdash; Designed for College Evaluator & Wipro CPPE Demonstration</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>AWS Serverless: API Gateway + Lambda + DynamoDB</span>
            <span>Amazon S3 + Glue + Athena</span>
            <span className="text-teal-400">Strict Personal Privacy (No Public Leaderboard)</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
