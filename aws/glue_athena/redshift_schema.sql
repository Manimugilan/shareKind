-- ============================================================================
-- SHAREKIND DATA ENGINEERING: AMAZON REDSHIFT STAR SCHEMA DDL & OLAP ANALYTICS
-- Cluster Architecture: Multi-node Redshift Cluster with columnar storage
-- Target Database: sharekind_dwh
-- Schema: analytics
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS analytics;

-- ----------------------------------------------------------------------------
-- 1. DIMENSION TABLE: Donors (Anonymized PII for Reporting)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.dim_donor (
    donor_key          INT IDENTITY(1,1),
    donor_id           VARCHAR(64) NOT NULL,
    anonymized_alias   VARCHAR(100) NOT NULL,
    total_lifetime_usd NUMERIC(12, 2) DEFAULT 0.00,
    tier_classification VARCHAR(32) DEFAULT 'COMMUNITY',
    created_at         TIMESTAMP DEFAULT SYSDATE,
    PRIMARY KEY (donor_key)
)
DISTSTYLE ALL
SORTKEY (donor_id);

-- ----------------------------------------------------------------------------
-- 2. DIMENSION TABLE: Verified NGOs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.dim_ngo (
    ngo_key            INT IDENTITY(1,1),
    ngo_id             VARCHAR(64) NOT NULL,
    ngo_name           VARCHAR(255) NOT NULL,
    category_focus     VARCHAR(64) NOT NULL,
    license_accredited BOOLEAN DEFAULT TRUE,
    region_district    VARCHAR(128) NOT NULL,
    PRIMARY KEY (ngo_key)
)
DISTSTYLE ALL
SORTKEY (ngo_id);

-- ----------------------------------------------------------------------------
-- 3. DIMENSION TABLE: Suppliers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.dim_supplier (
    supplier_key       INT IDENTITY(1,1),
    supplier_id        VARCHAR(64) NOT NULL,
    supplier_name      VARCHAR(255) NOT NULL,
    category           VARCHAR(64) NOT NULL,
    trust_score        NUMERIC(5, 2) DEFAULT 90.0,
    fulfillment_speed_days INT DEFAULT 2,
    PRIMARY KEY (supplier_key)
)
DISTSTYLE ALL
SORTKEY (supplier_id);

-- ----------------------------------------------------------------------------
-- 4. FACT TABLE: Contributions (High-Volume Transaction Fact)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.fact_donations (
    donation_id        VARCHAR(64) NOT NULL,
    donor_key          INT NOT NULL REFERENCES analytics.dim_donor(donor_key),
    ngo_key            INT NOT NULL REFERENCES analytics.dim_ngo(ngo_key),
    category           VARCHAR(64) NOT NULL,
    amount_usd         NUMERIC(10, 2) NOT NULL,
    meals_funded_equiv INT DEFAULT 0,
    transaction_date   TIMESTAMP NOT NULL,
    payment_status     VARCHAR(32) DEFAULT 'CONFIRMED',
    PRIMARY KEY (donation_id)
)
DISTKEY (ngo_key)
COMPOUND SORTKEY (transaction_date, category);

-- ----------------------------------------------------------------------------
-- 5. FACT TABLE: Procurement Orders
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.fact_procurement_orders (
    order_id           VARCHAR(64) NOT NULL,
    ngo_key            INT NOT NULL REFERENCES analytics.dim_ngo(ngo_key),
    supplier_key       INT NOT NULL REFERENCES analytics.dim_supplier(supplier_key),
    category           VARCHAR(64) NOT NULL,
    quantity_ordered   INT NOT NULL,
    total_cost_usd     NUMERIC(10, 2) NOT NULL,
    unit_cost_usd      NUMERIC(8, 2) NOT NULL,
    delivery_fee_usd   NUMERIC(8, 2) NOT NULL,
    status             VARCHAR(64) NOT NULL,
    created_at         TIMESTAMP NOT NULL,
    delivered_at       TIMESTAMP,
    delivery_duration_hours NUMERIC(6, 1),
    PRIMARY KEY (order_id)
)
DISTKEY (supplier_key)
COMPOUND SORTKEY (created_at, status);

-- ============================================================================
-- 6. AMAZON REDSHIFT S3 COPY SCRIPT (Loads Curated Parquet Data from S3 Lake)
-- ============================================================================
-- COPY analytics.fact_donations
-- FROM 's3://sharekind-analytics-438787411234-dev/curated/fact_donations/'
-- IAM_ROLE 'arn:aws:iam::438787411234:role/LabRole'
-- FORMAT AS PARQUET;

-- ============================================================================
-- 7. OLAP ANALYTICAL BUSINESS INTELLIGENCE QUERIES
-- ============================================================================

-- Query A: Supplier SLA Compliance & Average Unit Cost Benchmarking
SELECT 
    s.supplier_name,
    s.category,
    COUNT(f.order_id) AS total_orders_fulfilled,
    ROUND(AVG(f.unit_cost_usd), 2) AS avg_unit_cost,
    ROUND(AVG(f.delivery_duration_hours), 1) AS avg_fulfillment_hours,
    ROUND(SUM(f.total_cost_usd), 2) AS total_procurement_volume_usd,
    ROUND(100.0 * SUM(CASE WHEN f.delivery_duration_hours <= 48 THEN 1 ELSE 0 END) / COUNT(f.order_id), 1) AS sla_compliance_pct
FROM analytics.fact_procurement_orders f
JOIN analytics.dim_supplier s ON f.supplier_key = s.supplier_key
GROUP BY s.supplier_name, s.category
ORDER BY total_procurement_volume_usd DESC;

-- Query B: NGO Relief Needs vs Actual Allocation Ratio (Deficit Detection)
SELECT 
    n.ngo_name,
    n.region_district,
    d.category,
    SUM(d.amount_usd) AS total_donations_mobilized,
    COALESCE(SUM(p.total_cost_usd), 0) AS total_procured_usd,
    ROUND(SUM(d.amount_usd) - COALESCE(SUM(p.total_cost_usd), 0), 2) AS available_uncommitted_capital_usd
FROM analytics.fact_donations d
JOIN analytics.dim_ngo n ON d.ngo_key = n.ngo_key
LEFT JOIN analytics.fact_procurement_orders p ON n.ngo_key = p.ngo_key AND d.category = p.category
GROUP BY n.ngo_name, n.region_district, d.category
ORDER BY total_donations_mobilized DESC;
