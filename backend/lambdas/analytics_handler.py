"""
AWS Lambda Handler: Analytics & S3 Data Lake Export Pipeline
Routes: GET /api/analytics, POST /api/analytics/export
Aggregates platform KPIs, generates AI demand forecasts, and formats S3 / Glue exports.
"""

import json
import sys
import os
import csv
import io
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
from services.ai_engine import AIEngine
from services.rbac import SecurityService, Role

def lambda_handler(event, context):
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "GET")
    headers = event.get("headers") or {}
    user_id = headers.get("x-user-id") or "admin-1"
    user_role = headers.get("x-user-role") or "ADMIN"

    cors_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Role",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    }

    if http_method == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"status": "ok"})}

    try:
        if http_method == "GET":
            # Platform Metrics & Sizing
            all_donations = storage.list_all_donations()
            all_orders = list(storage.orders.values())
            all_needs = list(storage.needs.values())

            total_donated = sum(d.get("amount", 0) for d in all_donations)
            total_procured = sum(o.get("total_cost", 0) for o in all_orders)

            # Category Breakdown
            category_donations = {}
            for d in all_donations:
                cat = d.get("category", "food")
                category_donations[cat] = category_donations.get(cat, 0) + d.get("amount", 0)

            # AI Forecast Module
            forecast = AIEngine.forecast_demand(all_needs)

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "summary": {
                        "total_donations_value": round(total_donated, 2),
                        "total_donations_count": len(all_donations),
                        "total_procurement_expenditure": round(total_procured, 2),
                        "fulfilled_orders_count": len([o for o in all_orders if o.get("status") in ["delivered", "confirmed_distribution"]]),
                        "open_needs_count": len([n for n in all_needs if n.get("status") == "open"])
                    },
                    "category_breakdown": [
                        {"name": k.capitalize(), "value": round(v, 2)} for k, v in category_donations.items()
                    ],
                    "ai_forecast": forecast,
                    "is_demo_dataset": True
                })
            }

        elif http_method == "POST":
            # Export data lake artifacts
            body = json.loads(event.get("body") or "{}")
            format_type = body.get("format", "json").lower() # json or csv
            dataset_type = body.get("dataset", "donations")

            output_str = ""
            if dataset_type == "donations":
                records = storage.list_all_donations()
                # Sanitize donor personal data for analytics compliance
                sanitized_records = []
                for r in records:
                    item = dict(r)
                    item["donor_name"] = "ANONYMIZED_DONOR"
                    sanitized_records.append(item)
            elif dataset_type == "orders":
                sanitized_records = list(storage.orders.values())
            else:
                sanitized_records = list(storage.needs.values())

            if format_type == "csv":
                if sanitized_records:
                    csv_io = io.StringIO()
                    writer = csv.DictWriter(csv_io, fieldnames=sanitized_records[0].keys())
                    writer.writeheader()
                    writer.writerows(sanitized_records)
                    output_str = csv_io.getvalue()
                return {
                    "statusCode": 200,
                    "headers": {**cors_headers, "Content-Type": "text/csv", "Content-Disposition": f"attachment; filename=sharekind_{dataset_type}_export.csv"},
                    "body": output_str
                }
            else:
                return {
                    "statusCode": 200,
                    "headers": cors_headers,
                    "body": json.dumps({
                        "dataset": dataset_type,
                        "record_count": len(sanitized_records),
                        "records": sanitized_records,
                        "aws_s3_key": f"s3://sharekind-analytics-lake/{dataset_type}/partition_date=2026-10-12/data.json"
                    })
                }

        return {
            "statusCode": 405,
            "headers": cors_headers,
            "body": json.dumps({"error": f"Method {http_method} not allowed."})
        }

    except Exception as exc:
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({"error": f"Internal Server Error: {str(exc)}"})
        }
