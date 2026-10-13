"""
AWS Lambda Handler: Procurement Orders & Delivery State Machine
Routes: GET /api/orders, POST /api/orders, PUT /api/orders/{id}/status
Enforces finite state machine and role transitions:
Placed (NGO) -> Accepted (Supplier) -> In Prep (Supplier) -> Dispatched (Supplier) -> Delivered (Courier) -> Confirmed Distribution (NGO)
"""

import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.storage import storage
from services.rbac import SecurityService, Role

# Allowed transitions state machine
VALID_TRANSITIONS = {
    "placed": ["accepted", "cancelled"],
    "accepted": ["in_preparation", "cancelled"],
    "in_preparation": ["dispatched"],
    "dispatched": ["delivered"],
    "delivered": ["confirmed_distribution"],
    "confirmed_distribution": [] # Terminal state
}

ROLE_ALLOWED_ACTIONS = {
    "placed": [Role.NGO.value],
    "accepted": [Role.SUPPLIER.value],
    "in_preparation": [Role.SUPPLIER.value],
    "dispatched": [Role.SUPPLIER.value],
    "delivered": [Role.SUPPLIER.value, Role.ADMIN.value],
    "confirmed_distribution": [Role.NGO.value, Role.ADMIN.value]
}

def lambda_handler(event, context):
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "GET")
    headers = event.get("headers") or {}
    user_id = headers.get("x-user-id") or headers.get("X-User-Id", "ngo-1")
    user_role = headers.get("x-user-role") or headers.get("X-User-Role", "NGO")

    cors_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Role",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS"
    }

    if http_method == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"status": "ok"})}

    try:
        if http_method == "GET":
            orders = storage.list_orders(user_role, user_id)
            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({"orders": orders, "count": len(orders)})
            }

        elif http_method == "POST":
            # NGO creates/approves a procurement order
            if not SecurityService.verify_permission(user_role, "orders:create"):
                return {
                    "statusCode": 403,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Forbidden: Only NGOs can approve supplier quotes and place orders."})
                }

            body = json.loads(event.get("body") or "{}")
            supplier_id = body.get("supplier_id")
            supplier = storage.get_supplier(supplier_id)
            if not supplier:
                return {
                    "statusCode": 404,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Supplier not found."})
                }

            quantity = int(body.get("quantity", 100))
            unit_price = float(supplier.get("unit_price", 0))
            delivery_fee = float(supplier.get("delivery_fee", 0))
            total_cost = (unit_price * quantity) + delivery_fee

            ngo = storage.ngos.get(user_id, {"name": "Hope Haven Shelter"})

            order_data = {
                "need_id": body.get("need_id", "need-1"),
                "ngo_id": user_id,
                "ngo_name": ngo.get("name"),
                "supplier_id": supplier_id,
                "supplier_name": supplier.get("name"),
                "category": supplier.get("category"),
                "quantity": quantity,
                "unit_price": unit_price,
                "delivery_fee": delivery_fee,
                "total_cost": round(total_cost, 2),
                "status": "placed",
                "impact_summary": f"Procurement approved for {quantity} units from {supplier.get('name')}."
            }

            created = storage.create_order(order_data)
            
            # Audit log
            storage.record_audit(SecurityService.create_audit_record(
                action="PROCUREMENT_ORDER_CREATED",
                user_id=user_id,
                user_role=user_role,
                resource_id=created["id"],
                details={"supplier_id": supplier_id, "total_cost": total_cost}
            ))

            return {
                "statusCode": 201,
                "headers": cors_headers,
                "body": json.dumps({"message": "Procurement order placed successfully.", "order": created})
            }

        elif http_method == "PUT":
            # Update status
            path_params = event.get("pathParameters") or {}
            order_id = path_params.get("id") or event.get("queryStringParameters", {}).get("id")
            body = json.loads(event.get("body") or "{}")
            new_status = body.get("status")

            if not order_id or not new_status:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Missing order ID or new status."})
                }

            order = storage.orders.get(order_id)
            if not order:
                return {
                    "statusCode": 404,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Order not found."})
                }

            current_status = order.get("status", "placed")
            allowed_next = VALID_TRANSITIONS.get(current_status, [])

            if new_status not in allowed_next:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Invalid state transition from '{current_status}' to '{new_status}'. Allowed: {allowed_next}"})
                }

            # Check role permission for this target state
            allowed_roles = ROLE_ALLOWED_ACTIONS.get(new_status, [])
            if user_role not in allowed_roles:
                return {
                    "statusCode": 403,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Role '{user_role}' is not authorized to transition order to '{new_status}'."})
                }

            actor_label = f"{user_role} ({user_id})"
            updated = storage.update_order_status(order_id, new_status, actor_label)

            # Audit log
            storage.record_audit(SecurityService.create_audit_record(
                action="ORDER_STATUS_CHANGED",
                user_id=user_id,
                user_role=user_role,
                resource_id=order_id,
                details={"from_status": current_status, "to_status": new_status}
            ))

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({"message": "Order status updated successfully.", "order": updated})
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
