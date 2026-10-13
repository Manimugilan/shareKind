import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Sparkles, Search, Bot, BrainCircuit, Sliders, Play, 
  CheckCircle2, FileText, ArrowRight, RefreshCw, BookOpen, Layers
} from 'lucide-react';

export const Module3GenAIRAG: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rag' | 'prompt_studio' | 'ai_agent'>('rag');

  // RAG State
  const [ragQuery, setRagQuery] = useState<string>('What are Hope Haven nutrition and meal delivery guidelines?');
  const [isSearchingRag, setIsSearchingRag] = useState<boolean>(false);
  const [ragResult, setRagResult] = useState<any>(null);

  // Prompt Studio State
  const [selectedTemplate, setSelectedTemplate] = useState<string>('donor_storyteller');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [maxTokens, setMaxTokens] = useState<number>(250);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [promptResult, setPromptResult] = useState<any>(null);

  // AI Agent State
  const [agentGoal, setAgentGoal] = useState<string>(
    'Identify urgent food needs for Hope Haven, verify dietary SOPs, and prepare an optimal procurement plan under $400.'
  );
  const [isRunningAgent, setIsRunningAgent] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<any>(null);

  useEffect(() => {
    // Initial RAG query on mount
    handleExecuteRag(ragQuery);
    handleExecutePrompt();
  }, []);

  const handleExecuteRag = async (q: string) => {
    setIsSearchingRag(true);
    const res = await api.queryRag(q);
    setRagResult(res);
    setIsSearchingRag(false);
  };

  const handleExecutePrompt = async () => {
    setIsGeneratingPrompt(true);
    let params: any = {};
    if (selectedTemplate === 'donor_storyteller') {
      params = { amount: 100, ngo_name: "Hope Haven Shelter", category: "food" };
    } else if (selectedTemplate === 'need_synthesizer') {
      params = { field_notes: "We need 60 emergency lunch packs for children by noon tomorrow." };
    } else {
      params = { supplier_name: "Harvest Caterers", unit_price: 3.20, delivery_fee: 15.0, quantity: 100, speed_days: 1 };
    }

    const res = await api.generatePrompt({
      template_id: selectedTemplate,
      params,
      temperature,
      max_tokens: maxTokens
    });
    setPromptResult(res);
    setIsGeneratingPrompt(false);
  };

  const handleRunAgent = async () => {
    setIsRunningAgent(true);
    setAgentResult(null);
    const res = await api.runAutonomousAgent(agentGoal);
    setAgentResult(res);
    setIsRunningAgent(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-purple-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <BrainCircuit className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Wipro CPPE · Module 3
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Foundation Models & Agentic AI
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Generative AI, Foundation Models & RAG
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Multi-modal Generative AI architecture incorporating Retrieval-Augmented Generation (RAG) with vector embeddings, 
            fine-grained prompt engineering studios, and autonomous multi-step AI agents with ReAct reasoning loops.
          </p>

          {/* Subtopic Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Generative AI', 'Foundation Models (LLMs)', 'Prompt Engineering', 'RAG', 'Vector Embeddings', 'AI Agents (ReAct)'].map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/80 text-purple-200 px-3 py-1 rounded-lg border border-purple-500/30">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('rag')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'rag'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>RAG & Vector Knowledge Retrieval</span>
        </button>

        <button
          onClick={() => setActiveTab('prompt_studio')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'prompt_studio'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Prompt Engineering Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_agent')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'ai_agent'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Autonomous AI Agent (ReAct Loop)</span>
        </button>
      </div>

      {/* TAB 1: RAG & VECTOR SEARCH */}
      {activeTab === 'rag' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Search className="w-5 h-5 text-purple-600" />
                <span>RAG Semantic Knowledge Query & Citation Engine</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generates vector embeddings for user questions, performs cosine similarity search over ingested NGO charters, and synthesizes grounded answers with citations.
              </p>
            </div>

            {/* Query Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Ask about NGO nutritional guidelines, supplier scoring formulas, or privacy policies..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                onClick={() => handleExecuteRag(ragQuery)}
                disabled={isSearchingRag}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl flex items-center space-x-2 transition cursor-pointer disabled:opacity-60"
              >
                {isSearchingRag ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Retrieve & Answer</span>
              </button>
            </div>

            {/* Quick Sample Queries */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 self-center">Try queries:</span>
              {[
                "What are Hope Haven meal guidelines?",
                "What are Cedar Grove clothing rules?",
                "How does the AI scoring formula work?",
                "What is the donor privacy policy?"
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => { setRagQuery(sample); handleExecuteRag(sample); }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg transition border border-slate-200"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* RAG Synthesis Result */}
            {ragResult && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Synthesized Grounded Response</span>
                    </span>
                    <span className="font-mono text-purple-700 text-[11px]">
                      Model: {ragResult.foundation_model}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {ragResult.generated_response}
                  </p>
                </div>

                {/* Retrieved Sources / Citations */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Retrieved Document Chunks (Cosine Similarity Ranked)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ragResult.retrieved_sources?.map((src: any) => (
                      <div key={src.chunk_id || src.doc_id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate">{src.doc_title}</span>
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-100 text-purple-800">
                            Similarity: {(src.similarity_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          "{src.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROMPT ENGINEERING STUDIO */}
      {activeTab === 'prompt_studio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template & Hyperparameters Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>Prompt Parameters</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Pre-Engineered Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="donor_storyteller">Donor Impact Storyteller (Few-Shot)</option>
                    <option value="need_synthesizer">Emergency Relief Need Synthesizer</option>
                    <option value="supplier_auditor">Supplier Quote & SLA Auditor</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Temperature (Creativity)</span>
                    <span className="font-mono text-purple-700 font-bold">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full mt-1 accent-purple-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.0 (Deterministic)</span>
                    <span>1.0 (Creative)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Max Generation Tokens</span>
                    <span className="font-mono text-purple-700 font-bold">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full mt-1 accent-purple-600"
                  />
                </div>
              </div>

              <button
                onClick={handleExecutePrompt}
                disabled={isGeneratingPrompt}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isGeneratingPrompt ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Generate Completion</span>
              </button>
            </div>

            {/* Prompt Studio Output */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
                Prompt Studio Playground & Output
              </h3>

              {promptResult && (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">System Instructions</span>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 mt-1 font-mono text-[11px]">
                      {promptResult.system_prompt}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Rendered User Prompt</span>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 mt-1 font-mono text-[11px]">
                      {promptResult.formatted_prompt}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">Model Generated Completion</span>
                    <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-slate-800 mt-1 font-medium leading-relaxed">
                      {promptResult.model_completion}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTONOMOUS AI AGENT */}
      {activeTab === 'ai_agent' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <span>Autonomous Multi-Step AI Agent (ReAct Architecture)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The agent parses the high-level relief goal, interacts with system tools (needs registry, RAG vector base, supplier scoring), and formulates an optimal end-to-end plan.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={agentGoal}
                onChange={(e) => setAgentGoal(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleRunAgent}
                disabled={isRunningAgent}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl flex items-center space-x-2 transition cursor-pointer disabled:opacity-60"
              >
                {isRunningAgent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Run Autonomous Agent</span>
              </button>
            </div>

            {/* ReAct Reasoning Steps */}
            {agentResult && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ReAct Reasoning & Tool Execution Trace
                </h4>

                <div className="space-y-3">
                  {agentResult.steps?.map((st: any) => (
                    <div key={st.step} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900">Step {st.step} · ReAct Loop</span>
                        <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700">
                          {st.action}
                        </span>
                      </div>
                      <p className="text-slate-700"><strong>Thought:</strong> {st.thought}</p>
                      <p className="text-slate-600 text-[11px] bg-white/80 p-2 rounded border border-slate-200">
                        <strong>Observation:</strong> {st.observation}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final Solution */}
                <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{agentResult.final_solution?.title}</span>
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Savings: {agentResult.final_solution?.financial_breakdown?.budget_savings}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Recommended Supplier</span>
                      <strong className="text-white">{agentResult.final_solution?.recommended_supplier}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Order Cost</span>
                      <strong className="text-white">{agentResult.final_solution?.financial_breakdown?.total_order_cost}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Delivery Window</span>
                      <strong className="text-white">{agentResult.final_solution?.delivery_window}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
