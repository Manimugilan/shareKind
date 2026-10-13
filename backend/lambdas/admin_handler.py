"""
AWS Lambda Handler: Admin Governance & Verification Dashboard
Routes: GET /api/admin/audit-logs, POST /api/admin/verify
Enforces Role.ADMIN authorization for supplier/NGO accreditation and audit trail access.
"""

import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
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

    # Admin verification barrier
    if user_role != Role.ADMIN.value:
        return {
            "statusCode": 403,
            "headers": cors_headers,
            "body": json.dumps({"error": "Forbidden: Administrative privileges required."})
        }

    try:
        if http_method == "GET":
            logs = storage.get_audit_logs()
            unverified_suppliers = [s for s in storage.suppliers.values() if not s.get("verified")]
            unverified_ngos = [n for n in storage.ngos.values() if not n.get("verified")]

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "audit_logs": logs,
                    "pending_verification": {
                        "suppliers": unverified_suppliers,
                        "ngos": unverified_ngos
                    }
                })
            }

        elif http_method == "POST":
            body = json.loads(event.get("body") or "{}")
            target_type = body.get("type", "supplier") # supplier or ngo
            target_id = body.get("id")
            verified_status = bool(body.get("verified", True))

            if target_type == "supplier":
                updated = storage.set_supplier_verification(target_id, verified_status)
            elif target_type == "ngo" and target_id in storage.ngos:
                storage.ngos[target_id]["verified"] = verified_status
                updated = storage.ngos[target_id]
            else:
                updated = None

            if not updated:
                return {
                    "statusCode": 404,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Entity '{target_id}' of type '{target_type}' not found."})
                }

            # Record security audit log
            storage.record_audit(SecurityService.create_audit_record(
                action=f"{target_type.upper()}_VERIFICATION_UPDATED",
                user_id=user_id,
                user_role=user_role,
                resource_id=target_id,
                details={"verified": verified_status}
            ))

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "message": f"{target_type.capitalize()} verification updated.",
                    "entity": updated
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
