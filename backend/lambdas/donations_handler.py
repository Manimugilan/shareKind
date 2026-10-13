"""
AWS Lambda Handler: Donations Microservice
Routes: GET /api/donations, POST /api/donations
Enforces Donor personal data privacy (No public leaderboards, donor sees ONLY their own records).
"""

import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
from services.rbac import SecurityService, Role
from services.ai_engine import AIEngine

def lambda_handler(event, context):
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "GET")
    headers = event.get("headers") or {}
    
    # Extract identity & role from header or Cognito authorizer context
    user_id = headers.get("x-user-id") or headers.get("X-User-Id", "donor-1")
    user_role = headers.get("x-user-role") or headers.get("X-User-Role", "DONOR")

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
            # Donors can only retrieve their OWN donations (Personal Data Isolation)
            if user_role == Role.DONOR.value:
                donations = storage.get_donations_by_donor(user_id)
            elif user_role == Role.ADMIN.value:
                donations = storage.list_all_donations()
            else:
                return {
                    "statusCode": 403,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Unauthorized: Access restricted to authorized donor or admin."})
                }

            # Redact PII for any records not strictly belonging to user
            sanitized = [SecurityService.mask_donor_pii(d, {"user_id": user_id, "role": user_role}) for d in donations]
            
            # Calculate summary stats for the donor
            total_sum = sum(d.get("amount", 0) for d in sanitized)
            impact_calc = AIEngine.estimate_impact(total_sum, "food")

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "donations": sanitized,
                    "donor_id": user_id,
                    "total_contributions": round(total_sum, 2),
                    "impact_estimate": impact_calc
                })
            }

        elif http_method == "POST":
            # RBAC check: Only DONOR can make donations
            if not SecurityService.verify_permission(user_role, "donations:create"):
                return {
                    "statusCode": 403,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Forbidden: Current role lacks donations:create permission."})
                }

            body = json.loads(event.get("body") or "{}")
            amount = float(body.get("amount", 0))
            if amount <= 0:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Donation amount must be greater than zero."})
                }

            category = body.get("category", "food")
            ngo_id = body.get("ngo_id", "ngo-1")
            ngo = storage.ngos.get(ngo_id, {"name": "Verified Community NGO"})

            # Estimate impact via AI Engine
            impact_res = AIEngine.estimate_impact(amount, category)

            donation_record = {
                "donor_id": user_id,
                "donor_name": body.get("donor_name", "Sarah Jenkins"),
                "amount": amount,
                "category": category,
                "ngo_id": ngo_id,
                "ngo_name": ngo.get("name"),
                "status": "allocated",
                "payment_ref": f"SIM_PAY_{int(sys.time() if hasattr(sys, 'time') else 1700000000)}",
                "is_demo": True,
                "impact": f"{impact_res['impact_units']} {impact_res['metric_label']} funded"
            }

            created = storage.create_donation(donation_record)
            
            # Record audit log
            storage.record_audit(SecurityService.create_audit_record(
                action="DONATION_CREATED",
                user_id=user_id,
                user_role=user_role,
                resource_id=created["id"],
                details={"amount": amount, "category": category, "ngo_id": ngo_id}
            ))

            return {
                "statusCode": 201,
                "headers": cors_headers,
                "body": json.dumps({"message": "Donation recorded successfully.", "donation": created})
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
