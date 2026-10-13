-- ====================================================================
-- AWS Athena Analytical Queries for ShareKind Platform
-- Database: sharekind_analytics_db
-- ====================================================================

-- 1. Total Donation Volume and Count by Category
SELECT 
    category,
    COUNT(donation_id) AS total_donations_count,
    ROUND(SUM(amount), 2) AS total_funds_collected,
    ROUND(AVG(amount), 2) AS average_donation_size
FROM sharekind_analytics_db.donations
WHERE is_demo = false -- Filter real production transactions
GROUP BY category
ORDER BY total_funds_collected DESC;

-- 2. Procurement Cost Efficiency & Supplier Fulfillment Performance
SELECT 
    supplier_name,
    item_category,
    COUNT(order_id) AS total_orders_fulfilled,
    ROUND(AVG(unit_price), 2) AS avg_unit_price,
    ROUND(SUM(total_cost), 2) AS total_procurement_expenditure,
    ROUND(AVG(date_diff('hour', dispatched_at, delivered_at)), 1) AS avg_delivery_turnaround_hours
FROM sharekind_analytics_db.procurement_orders
WHERE status IN ('delivered', 'confirmed_distribution')
GROUP BY supplier_name, item_category
ORDER BY total_orders_fulfilled DESC;

-- 3. NGO Need Fulfillment Ratio and Pending Gaps
SELECT 
    n.ngo_name,
    n.category,
    SUM(n.target_quantity) AS total_needed_units,
    COALESCE(SUM(p.quantity), 0) AS total_procured_units,
    ROUND(
        (COALESCE(SUM(p.quantity), 0) * 100.0) / NULLIF(SUM(n.target_quantity), 0), 
        1
    ) AS fulfillment_percentage
FROM sharekind_analytics_db.ngo_needs n
LEFT JOIN sharekind_analytics_db.procurement_orders p 
    ON n.need_id = p.need_id AND p.status != 'cancelled'
GROUP BY n.ngo_name, n.category
ORDER BY fulfillment_percentage ASC;

-- 4. Monthly Trend Analysis for Demand Forecasting & Sizing
SELECT 
    date_trunc('month', created_at) AS report_month,
    category,
    COUNT(order_id) AS orders_count,
    SUM(quantity) AS units_distributed,
    SUM(total_cost) AS total_impact_cost
FROM sharekind_analytics_db.procurement_orders
GROUP BY date_trunc('month', created_at), category
ORDER BY report_month DESC;
