"""
AWS Lambda Handler: NGO Needs Microservice
Routes: GET /api/needs, POST /api/needs
Enforces RBAC: Only NGOs can publish new requirements.
"""

import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
from services.rbac import SecurityService

def lambda_handler(event, context):
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "GET")
    headers = event.get("headers") or {}
    user_id = headers.get("x-user-id") or headers.get("X-User-Id", "ngo-1")
    user_role = headers.get("x-user-role") or headers.get("X-User-Role", "NGO")

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
            needs = storage.list_needs(category)
            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({"needs": needs, "count": len(needs)})
            }

        elif http_method == "POST":
            # RBAC check: Must have needs:create permission
            if not SecurityService.verify_permission(user_role, "needs:create"):
                return {
                    "statusCode": 403,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Forbidden: Only verified NGOs can publish community needs."})
                }

            body = json.loads(event.get("body") or "{}")
            title = body.get("title")
            category = body.get("category", "food")
            target_qty = int(body.get("target_quantity", 50))
            budget = float(body.get("budget_estimate", 500.0))

            if not title or target_qty <= 0:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Title and target quantity (>0) are required."})
                }

            ngo = storage.ngos.get(user_id, {"name": "Hope Haven Shelter", "location": "Downtown"})

            need_record = {
                "ngo_id": user_id,
                "ngo_name": ngo.get("name"),
                "title": title,
                "category": category,
                "target_quantity": target_qty,
                "fulfilled_quantity": 0,
                "budget_estimate": budget,
                "urgency": body.get("urgency", "High"),
                "status": "open",
                "location": body.get("location", ngo.get("location")),
                "is_demo": True
            }

            created = storage.create_need(need_record)

            # Audit record
            storage.record_audit(SecurityService.create_audit_record(
                action="NEED_PUBLISHED",
                user_id=user_id,
                user_role=user_role,
                resource_id=created["id"],
                details={"title": title, "category": category, "quantity": target_qty}
            ))

            return {
                "statusCode": 201,
                "headers": cors_headers,
                "body": json.dumps({"message": "Need published successfully.", "need": created})
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
