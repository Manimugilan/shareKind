"""
AWS Lambda Handler: Supplier Marketplace & AI Comparison Engine
Routes: GET /api/suppliers, POST /api/suppliers/compare
Calculates transparent quotes: unit_price * qty + delivery_fee with explainable AI scores.
"""

import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
from services.ai_engine import AIEngine

def lambda_handler(event, context):
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("path") or event.get("rawPath", "")

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
            query_params = event.get("queryStringParameters") or {}
            category = query_params.get("category")
            suppliers = storage.list_suppliers(category)
            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({"suppliers": suppliers, "count": len(suppliers)})
            }

        elif http_method == "POST":
            # Compare and rank suppliers using AI explainable scoring
            body = json.loads(event.get("body") or "{}")
            category = body.get("category", "food")
            requested_qty = int(body.get("quantity", 100))

            all_suppliers = storage.list_suppliers(category)
            ranked = AIEngine.rank_suppliers(all_suppliers, requested_qty, category)

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "category": category,
                    "requested_quantity": requested_qty,
                    "ranked_quotes": ranked,
                    "explanation_notes": "Scored on Cost (35%), Trust/Verification (30%), Speed (20%), and Capacity (15%)."
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
