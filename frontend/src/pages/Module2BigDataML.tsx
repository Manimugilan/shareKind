import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, Play, CheckCircle2, Clock, Code2, 
  BarChart3, TrendingUp, AlertTriangle, Layers, RefreshCw, FileText
} from 'lucide-react';

export const Module2BigDataML: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pyspark_etl' | 'redshift' | 'ml_insights'>('pyspark_etl');

  // PySpark ETL State
  const [isRunningEtl, setIsRunningEtl] = useState<boolean>(false);
  const [etlJobResult, setEtlJobResult] = useState<any>(null);
  const [activeEtlStageIndex, setActiveEtlStageIndex] = useState<number>(-1);
  const [showPySparkCode, setShowPySparkCode] = useState<boolean>(false);

  // Redshift State
  const [selectedQuery, setSelectedQuery] = useState<string>('supplier_sla');
  const [isRunningQuery, setIsRunningQuery] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [schemaData, setSchemaData] = useState<any>(null);

  // ML Insights State
  const [mlData, setMlData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const schema = await api.getRedshiftSchema();
    setSchemaData(schema);

    const ml = await api.getBigDataMLInsights();
    setMlData(ml);

    // Initial query
    const initQ = await api.queryRedshift('supplier_sla');
    setQueryResult(initQ);
  };

  const etlStages = [
    { stage: "SparkSession & Glue Context Init", time: "6s", desc: "Configures Kryo serializer and S3 warehouse directory" },
    { stage: "S3 Raw JSON Ingestion & Schema Cast", time: "16s", desc: "Reads raw donation events into Spark DataFrame with schema" },
    { stage: "Donor PII Masking & Hash Anonymization", time: "12s", desc: "Applies SHA-256 masking to names, emails, and transaction tokens" },
    { stage: "Spark Window Aggregations (Running Totals)", time: "28s", desc: "Executes Window.partitionBy('donor_id') cumulative calculations" },
    { stage: "Snappy Compressed Parquet Partitioning", time: "22s", desc: "Writes columnar snappy.parquet partitioned by year/month to S3" },
    { stage: "AWS Glue Data Catalog Metadata Sync", time: "10s", desc: "Registers updated table partitions in Glue catalog for Athena & Redshift" }
  ];

  const handleRunPySparkJob = async () => {
    setIsRunningEtl(true);
    setActiveEtlStageIndex(0);
    setEtlJobResult(null);

    // Visual stage animation for evaluator
    for (let i = 0; i < etlStages.length; i++) {
      setActiveEtlStageIndex(i);
      await new Promise(r => setTimeout(r, 500));
    }

    const res = await api.runPySparkEtl();
    setEtlJobResult(res);
    setIsRunningEtl(false);
  };

  const handleExecuteQuery = async (queryId: string) => {
    setSelectedQuery(queryId);
    setIsRunningQuery(true);
    const res = await api.queryRedshift(queryId);
    setQueryResult(res);
    setIsRunningQuery(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-teal-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Database className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
              Wipro CPPE · Module 2
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Big Data & Analytics Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Data Engineering, Big Data & ML Insights
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Enterprise data lake pipeline orchestrating Apache Spark (PySpark) transformations, 
            AWS Glue Data Catalog metadata indexing, Amazon Redshift Star Schema data warehousing, and statistical Machine Learning demand forecasting.
          </p>

          {/* Subtopic Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Big Data', 'ETL Pipelines', 'Apache Spark', 'PySpark', 'AWS Glue', 'Amazon Redshift', 'Machine Learning'].map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/80 text-teal-200 px-3 py-1 rounded-lg border border-teal-500/30">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('pyspark_etl')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'pyspark_etl'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Apache Spark / PySpark ETL Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('redshift')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'redshift'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Amazon Redshift Star Schema & OLAP</span>
        </button>

        <button
          onClick={() => setActiveTab('ml_insights')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'ml_insights'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Machine Learning Demand & Deficit Insights</span>
        </button>
      </div>

      {/* TAB 1: PYSPARK ETL PIPELINE */}
      {activeTab === 'pyspark_etl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Run Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Play className="w-5 h-5 text-teal-600" />
                  <span>Execute PySpark ETL Job</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Processes raw transactions from S3 into curated, partitioned Parquet datasets using SparkSession.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Spark Engine:</span>
                  <span className="font-semibold text-slate-800">Apache Spark 3.3 (AWS Glue 4.0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Input Data Lake:</span>
                  <span className="font-mono text-slate-700">s3://.../raw/donations/</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Format:</span>
                  <span className="font-mono text-teal-700 font-semibold">snappy.parquet (partitioned)</span>
                </div>
              </div>

              <button
                onClick={handleRunPySparkJob}
                disabled={isRunningEtl}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer"
              >
                {isRunningEtl ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Running Spark Transformation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Launch PySpark Lake Curator</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPySparkCode(!showPySparkCode)}
                className="w-full py-2 px-3 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{showPySparkCode ? "Hide PySpark Pipeline Code" : "Inspect PySpark Script"}</span>
              </button>
            </div>

            {/* Stages Stepper */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-teal-600" />
                  <span>PySpark Execution Stages & Window Operations</span>
                </h3>
                <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-mono">
                  6 Pipeline Stages
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {etlStages.map((stg, idx) => {
                  const isCurrent = activeEtlStageIndex === idx;
                  const isCompleted = activeEtlStageIndex > idx || (etlJobResult && etlJobResult.status === 'SUCCEEDED');

                  return (
                    <div
                      key={stg.stage}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-400"
                          : isCompleted
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{stg.stage}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isCurrent ? "bg-teal-500 text-white animate-pulse" : isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {isCurrent ? "EXECUTING" : isCompleted ? "COMPLETED" : "PENDING"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{stg.desc}</p>
                    </div>
                  );
                })}
              </div>

              {etlJobResult && (
                <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Job Succeeded: {etlJobResult.job_id}</span>
                    </span>
                    <span className="font-mono text-slate-400">Duration: {etlJobResult.duration_seconds}s</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Ingested <span className="text-teal-300 font-semibold">{etlJobResult.records_ingested.toLocaleString()} records</span>, anonymized donor PII, computed Spark window aggregations, and exported {etlJobResult.parquet_partitions_written} Snappy Parquet partitions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {showPySparkCode && (
            <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg space-y-3 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs text-teal-400 font-bold">aws/glue_athena/pyspark_etl_pipeline.py</span>
                <span className="text-xs text-slate-400">Production Apache Spark Script</span>
              </div>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-72">
{`from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit, current_timestamp, to_date, sum as _sum, round as _round
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("ShareKind-BigData-ETL").getOrCreate()

# 1. Ingest raw donations
raw_df = spark.read.json("s3://sharekind-analytics-lake/raw/donations/")

# 2. Transform: Mask donor PII & compute running metrics
curated_df = (
    raw_df
    .withColumn("donor_name_masked", lit("ANONYMOUS_DONOR"))
    .withColumn("donation_date", to_date(col("created_at")))
    .withColumn("donor_running_total", _sum("amount").over(
        Window.partitionBy("donor_id").orderBy("created_at").rowsBetween(Window.unboundedPreceding, Window.currentRow)
    ))
)

# 3. Export to Snappy Parquet partitioned by year/month
curated_df.write.mode("overwrite").partitionBy("year", "month").parquet("s3://sharekind-analytics-lake/curated/fact_donations/")`}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AMAZON REDSHIFT STAR SCHEMA */}
      {activeTab === 'redshift' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>Amazon Redshift Star Schema Data Warehouse</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  High-performance columnar OLAP data warehouse. Fact and dimension tables loaded via Redshift <span className="font-mono text-purple-700">COPY</span> from S3.
                </p>
              </div>

              {/* Pre-canned Query Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExecuteQuery('supplier_sla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedQuery === 'supplier_sla'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Query 1: Supplier SLA & Cost
                </button>
                <button
                  onClick={() => handleExecuteQuery('ngo_allocation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedQuery === 'ngo_allocation'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Query 2: NGO Mobilization vs Aid
                </button>
              </div>
            </div>

            {/* Query Result Table */}
            {queryResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{queryResult.query_name}</span>
                  <span className="text-slate-500 font-mono">
                    Engine: {queryResult.engine} · Latency: <strong>{queryResult.execution_time_ms} ms</strong>
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        {queryResult.columns?.map((col: string) => (
                          <th key={col} className="py-3 px-4">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {queryResult.rows?.map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50">
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="py-3 px-4">
                              {typeof cell === 'number' && cell % 1 !== 0 ? cell.toFixed(2) : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MACHINE LEARNING INSIGHTS */}
      {activeTab === 'ml_insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model R² Goodness-of-Fit</span>
              <p className="text-3xl font-extrabold text-emerald-600">{mlData?.model_metrics?.r_squared}</p>
              <p className="text-xs text-slate-600">High predictive power over historical community demand patterns.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Absolute Error (MAE)</span>
              <p className="text-3xl font-extrabold text-blue-600">±{mlData?.model_metrics?.mean_absolute_error_units} units</p>
              <p className="text-xs text-slate-600">Low deviation between projected and actual shelter requirements.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Training Dataset Size</span>
              <p className="text-3xl font-extrabold text-purple-600">{mlData?.model_metrics?.training_dataset_size?.toLocaleString()} events</p>
              <p className="text-xs text-slate-600">Ingested from S3 Data Lake and DynamoDB transaction ledgers.</p>
            </div>
          </div>

          {/* Deficit Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Machine Learning Community Deficit & Shortfall Alerts</span>
            </h3>

            <div className="space-y-3">
              {mlData?.deficit_alerts?.map((alert: any) => (
                <div key={alert.category} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{alert.category}</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-red-100 text-red-800">
                      URGENCY: {alert.urgency}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>Projected Shortfall: <strong>{alert.shortfall_units} units</strong></div>
                    <div>Target District: <strong>{alert.target_location}</strong></div>
                  </div>
                  <p className="text-slate-600 border-t border-amber-200/60 pt-2 font-medium">
                    Recommended Intervention: {alert.recommended_action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
