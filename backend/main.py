"""
ShareKind Local API Gateway & Development Server (FastAPI)
Provides live REST API endpoints mirroring AWS API Gateway & Lambda microservices.
Enables instant local execution and automated Swagger documentation at /docs.
"""

from fastapi import FastAPI, Header, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import time
import io
import csv

from services.storage import storage
from services.rbac import SecurityService, Role
from services.ai_engine import AIEngine
from services.platform_engineering import platform_service
from services.bigdata_engine import bigdata_service
from services.genai_engine import genai_service
from services.security_governance import security_governance_service

app = FastAPI(
    title="ShareKind Core API Gateway",
    description="Smart Donation & Community Support Platform — REST APIs with RBAC, AI Supplier Ranking, and Data Pipelines.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------
class DonationCreateRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Contribution amount in USD")
    category: str = Field("food", description="food, groceries, clothing, or general")
    ngo_id: str = Field("ngo-1", description="Target verified NGO identifier")
    donor_name: Optional[str] = "Sarah Jenkins"

class NeedCreateRequest(BaseModel):
    title: str
    category: str = "food"
    target_quantity: int = Field(..., gt=0)
    budget_estimate: float = Field(..., gt=0)
    urgency: str = "High"
    location: Optional[str] = "Metro District"

class SupplierCompareRequest(BaseModel):
    category: str = "food"
    quantity: int = Field(100, gt=0)

class OrderCreateRequest(BaseModel):
    need_id: str
    supplier_id: str
    quantity: int = Field(..., gt=0)

class OrderStatusUpdateRequest(BaseModel):
    status: str

class VerifyRequest(BaseModel):
    type: str = "supplier" # supplier or ngo
    id: str
    verified: bool = True

# --- Module 1 Models ---
class StepFunctionExecuteRequest(BaseModel):
    order_id: str = "ord-101"
    supplier_id: str = "sup-1"
    quantity: int = 100
    budget: float = 400.0

class CicdTriggerRequest(BaseModel):
    branch: str = "main"
    triggered_by: str = "Evaluator"

# --- Module 2 Models ---
class RedshiftQueryRequest(BaseModel):
    query_id: str = "supplier_sla"

# --- Module 3 Models ---
class RagQueryRequest(BaseModel):
    query: str
    top_k: int = 2

class PromptGenerateRequest(BaseModel):
    template_id: str
    params: Dict[str, Any]
    temperature: float = 0.3
    max_tokens: int = 250

class AgentExecuteRequest(BaseModel):
    goal: str

# --- Module 4 Models ---
class KmsEncryptRequest(BaseModel):
    plaintext: str

class KmsDecryptRequest(BaseModel):
    encrypted_data_key_hex: str
    ciphertext_base64: str
    initialization_vector_hex: str
    auth_tag_hex: str

class IamEvaluateRequest(BaseModel):
    role: str
    action: str
    resource: str = "*"

# ----------------- Health & Info -----------------
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "ShareKind Core API Gateway",
        "timestamp": int(time.time()),
        "mode": "DEMO / HYBRID LOCAL ADAPTER",
        "aws_connected": storage.use_aws_dynamo
    }

# ----------------- 1. Donations -----------------
@app.get("/api/donations", tags=["Donations"])
def get_donations(
    x_user_id: str = Header(default="donor-1"),
    x_user_role: str = Header(default="DONOR")
):
    if x_user_role == Role.DONOR.value:
        donations = storage.get_donations_by_donor(x_user_id)
    elif x_user_role == Role.ADMIN.value:
        donations = storage.list_all_donations()
    else:
        raise HTTPException(status_code=403, detail="Unauthorized: Access restricted to authorized donor or admin.")

    sanitized = [SecurityService.mask_donor_pii(d, {"user_id": x_user_id, "role": x_user_role}) for d in donations]
    total_sum = sum(d.get("amount", 0) for d in sanitized)
    impact_calc = AIEngine.estimate_impact(total_sum, "food")

    return {
        "donations": sanitized,
        "donor_id": x_user_id,
        "total_contributions": round(total_sum, 2),
        "impact_estimate": impact_calc
    }

@app.post("/api/donations", status_code=201, tags=["Donations"])
def create_donation(
    req: DonationCreateRequest,
    x_user_id: str = Header(default="donor-1"),
    x_user_role: str = Header(default="DONOR")
):
    if not SecurityService.verify_permission(x_user_role, "donations:create"):
        raise HTTPException(status_code=403, detail="Forbidden: Current role lacks donations:create permission.")

    ngo = storage.ngos.get(req.ngo_id, {"name": "Verified Community Organization"})
    impact_res = AIEngine.estimate_impact(req.amount, req.category)

    donation_record = {
        "donor_id": x_user_id,
        "donor_name": req.donor_name,
        "amount": req.amount,
        "category": req.category,
        "ngo_id": req.ngo_id,
        "ngo_name": ngo.get("name"),
        "status": "allocated",
        "payment_ref": f"SIM_PAY_{int(time.time())}",
        "is_demo": True,
        "impact": f"{impact_res['impact_units']} {impact_res['metric_label']} funded"
    }

    created = storage.create_donation(donation_record)
    storage.record_audit(SecurityService.create_audit_record(
        action="DONATION_CREATED",
        user_id=x_user_id,
        user_role=x_user_role,
        resource_id=created["id"],
        details={"amount": req.amount, "category": req.category, "ngo_id": req.ngo_id}
    ))
    return {"message": "Donation recorded successfully.", "donation": created}

# ----------------- 2. NGO Needs -----------------
@app.get("/api/needs", tags=["NGO Needs"])
def get_needs(category: Optional[str] = None):
    needs = storage.list_needs(category)
    return {"needs": needs, "count": len(needs)}

@app.post("/api/needs", status_code=201, tags=["NGO Needs"])
def create_need(
    req: NeedCreateRequest,
    x_user_id: str = Header(default="ngo-1"),
    x_user_role: str = Header(default="NGO")
):
    if not SecurityService.verify_permission(x_user_role, "needs:create"):
        raise HTTPException(status_code=403, detail="Forbidden: Only verified NGOs can publish community needs.")

    ngo = storage.ngos.get(x_user_id, {"name": "Hope Haven Shelter", "location": "Downtown"})
    need_record = {
        "ngo_id": x_user_id,
        "ngo_name": ngo.get("name"),
        "title": req.title,
        "category": req.category,
        "target_quantity": req.target_quantity,
        "fulfilled_quantity": 0,
        "budget_estimate": req.budget_estimate,
        "urgency": req.urgency,
        "status": "open",
        "location": req.location or ngo.get("location"),
        "is_demo": True
    }
    created = storage.create_need(need_record)
    storage.record_audit(SecurityService.create_audit_record(
        action="NEED_PUBLISHED",
        user_id=x_user_id,
        user_role=x_user_role,
        resource_id=created["id"],
        details={"title": req.title, "quantity": req.target_quantity}
    ))
    return {"message": "Need published successfully.", "need": created}

# ----------------- 3. Suppliers & AI Comparison -----------------
@app.get("/api/suppliers", tags=["Suppliers"])
def get_suppliers(category: Optional[str] = None):
    suppliers = storage.list_suppliers(category)
    return {"suppliers": suppliers, "count": len(suppliers)}

@app.post("/api/suppliers/compare", tags=["Suppliers"])
def compare_suppliers(req: SupplierCompareRequest):
    all_suppliers = storage.list_suppliers(req.category)
    ranked = AIEngine.rank_suppliers(all_suppliers, req.quantity, req.category)
    return {
        "category": req.category,
        "requested_quantity": req.quantity,
        "ranked_quotes": ranked,
        "scoring_weights": {"cost": "35%", "trust": "30%", "speed": "20%", "capacity": "15%"}
    }

# ----------------- 4. Procurement Orders & Tracking -----------------
@app.get("/api/orders", tags=["Procurement Orders"])
def get_orders(
    x_user_id: str = Header(default="ngo-1"),
    x_user_role: str = Header(default="NGO")
):
    orders = storage.list_orders(x_user_role, x_user_id)
    return {"orders": orders, "count": len(orders)}

@app.post("/api/orders", status_code=201, tags=["Procurement Orders"])
def create_order(
    req: OrderCreateRequest,
    x_user_id: str = Header(default="ngo-1"),
    x_user_role: str = Header(default="NGO")
):
    if not SecurityService.verify_permission(x_user_role, "orders:create"):
        raise HTTPException(status_code=403, detail="Forbidden: Only NGOs can approve supplier quotes and place procurement orders.")

    supplier = storage.get_supplier(req.supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    unit_price = float(supplier.get("unit_price", 0))
    delivery_fee = float(supplier.get("delivery_fee", 0))
    total_cost = (unit_price * req.quantity) + delivery_fee
    ngo = storage.ngos.get(x_user_id, {"name": "Hope Haven Shelter"})

    order_data = {
        "need_id": req.need_id,
        "ngo_id": x_user_id,
        "ngo_name": ngo.get("name"),
        "supplier_id": req.supplier_id,
        "supplier_name": supplier.get("name"),
        "category": supplier.get("category"),
        "quantity": req.quantity,
        "unit_price": unit_price,
        "delivery_fee": delivery_fee,
        "total_cost": round(total_cost, 2),
        "status": "placed",
        "impact_summary": f"Procurement approved for {req.quantity} units from {supplier.get('name')}."
    }

    created = storage.create_order(order_data)
    storage.record_audit(SecurityService.create_audit_record(
        action="PROCUREMENT_ORDER_CREATED",
        user_id=x_user_id,
        user_role=x_user_role,
        resource_id=created["id"],
        details={"supplier_id": req.supplier_id, "total_cost": total_cost}
    ))
    return {"message": "Order created successfully.", "order": created}

@app.put("/api/orders/{order_id}/status", tags=["Procurement Orders"])
def update_order_status(
    order_id: str,
    req: OrderStatusUpdateRequest,
    x_user_id: str = Header(default="sup-1"),
    x_user_role: str = Header(default="SUPPLIER")
):
    order = storage.orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    current_status = order.get("status", "placed")
    from lambdas.procurement_handler import VALID_TRANSITIONS, ROLE_ALLOWED_ACTIONS

    allowed_next = VALID_TRANSITIONS.get(current_status, [])
    if req.status not in allowed_next:
        raise HTTPException(status_code=400, detail=f"Invalid transition from '{current_status}' to '{req.status}'. Allowed: {allowed_next}")

    allowed_roles = ROLE_ALLOWED_ACTIONS.get(req.status, [])
    if x_user_role not in allowed_roles:
        raise HTTPException(status_code=403, detail=f"Role '{x_user_role}' is not authorized to move order to '{req.status}'.")

    updated = storage.update_order_status(order_id, req.status, f"{x_user_role} ({x_user_id})")
    storage.record_audit(SecurityService.create_audit_record(
        action="ORDER_STATUS_CHANGED",
        user_id=x_user_id,
        user_role=x_user_role,
        resource_id=order_id,
        details={"from_status": current_status, "to_status": req.status}
    ))
    return {"message": "Order status updated.", "order": updated}

# ----------------- 5. Analytics & Export -----------------
@app.get("/api/analytics", tags=["Analytics"])
def get_analytics():
    all_donations = storage.list_all_donations()
    all_orders = list(storage.orders.values())
    all_needs = list(storage.needs.values())

    total_donated = sum(d.get("amount", 0) for d in all_donations)
    total_procured = sum(o.get("total_cost", 0) for o in all_orders)

    category_donations = {}
    for d in all_donations:
        cat = d.get("category", "food")
        category_donations[cat] = category_donations.get(cat, 0) + d.get("amount", 0)

    forecast = AIEngine.forecast_demand(all_needs)

    return {
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
    }

# ----------------- 6. Admin & Audit Logs -----------------
@app.get("/api/admin/audit-logs", tags=["Admin"])
def get_admin_dashboard(x_user_role: str = Header(default="ADMIN")):
    if x_user_role != Role.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: Administrative privileges required.")
    
    return {
        "audit_logs": storage.get_audit_logs(),
        "pending_verification": {
            "suppliers": [s for s in storage.suppliers.values() if not s.get("verified")],
            "ngos": [n for n in storage.ngos.values() if not n.get("verified")]
        }
    }

@app.post("/api/admin/verify", tags=["Admin"])
def verify_entity(req: VerifyRequest, x_user_role: str = Header(default="ADMIN"), x_user_id: str = Header(default="admin-1")):
    if x_user_role != Role.ADMIN.value:
        raise HTTPException(status_code=403, detail="Forbidden: Administrative privileges required.")

    if req.type == "supplier":
        updated = storage.set_supplier_verification(req.id, req.verified)
    elif req.type == "ngo" and req.id in storage.ngos:
        storage.ngos[req.id]["verified"] = req.verified
        updated = storage.ngos[req.id]
    else:
        updated = None

    if not updated:
        raise HTTPException(status_code=404, detail="Entity not found.")

    storage.record_audit(SecurityService.create_audit_record(
        action=f"{req.type.upper()}_VERIFICATION_UPDATED",
        user_id=x_user_id,
        user_role=x_user_role,
        resource_id=req.id,
        details={"verified": req.verified}
    ))
    return {"message": "Verification status updated.", "entity": updated}

# =====================================================================
# MODULE 1: CLOUD PRODUCT & PLATFORM ENGINEERING ENDPOINTS
# =====================================================================
@app.get("/api/platform/health", tags=["Module 1: Platform Engineering"])
def get_platform_health():
    return platform_service.get_microservices_health()

@app.get("/api/platform/step-functions/definition", tags=["Module 1: Platform Engineering"])
def get_step_functions_definition():
    return platform_service.get_state_machine_definition()

@app.get("/api/platform/step-functions/executions", tags=["Module 1: Platform Engineering"])
def list_step_function_executions():
    return {"executions": platform_service.executions}

@app.post("/api/platform/step-functions/execute", tags=["Module 1: Platform Engineering"])
def execute_step_function(req: StepFunctionExecuteRequest):
    return platform_service.execute_state_machine(
        order_id=req.order_id,
        supplier_id=req.supplier_id,
        quantity=req.quantity,
        budget=req.budget
    )

@app.get("/api/platform/cicd/pipeline", tags=["Module 1: Platform Engineering"])
def get_cicd_pipeline():
    return {"pipeline_runs": platform_service.pipeline_runs}

@app.post("/api/platform/cicd/trigger", tags=["Module 1: Platform Engineering"])
def trigger_cicd(req: CicdTriggerRequest):
    return platform_service.trigger_cicd_pipeline(branch=req.branch, triggered_by=req.triggered_by)

# =====================================================================
# MODULE 2: DATA ENGINEERING, BIG DATA & ML INSIGHTS ENDPOINTS
# =====================================================================
@app.post("/api/bigdata/etl/run", tags=["Module 2: Big Data & ML"])
def run_pyspark_etl():
    return bigdata_service.trigger_pyspark_job()

@app.get("/api/bigdata/etl/history", tags=["Module 2: Big Data & ML"])
def get_pyspark_etl_history():
    return {"history": bigdata_service.etl_history}

@app.get("/api/bigdata/redshift/schema", tags=["Module 2: Big Data & ML"])
def get_redshift_schema():
    return {"tables": bigdata_service.redshift_tables}

@app.post("/api/bigdata/redshift/query", tags=["Module 2: Big Data & ML"])
def run_redshift_query(req: RedshiftQueryRequest):
    return bigdata_service.execute_redshift_query(req.query_id)

@app.get("/api/bigdata/ml/insights", tags=["Module 2: Big Data & ML"])
def get_ml_insights():
    return bigdata_service.get_ml_insights()

# =====================================================================
# MODULE 3: GENERATIVE AI, FOUNDATION MODELS & RAG ENDPOINTS
# =====================================================================
@app.get("/api/genai/knowledge-base", tags=["Module 3: GenAI & RAG"])
def get_knowledge_base():
    return {"documents": genai_service.knowledge_documents}

@app.post("/api/genai/rag/query", tags=["Module 3: GenAI & RAG"])
def query_rag(req: RagQueryRequest):
    return genai_service.rag_search_and_generate(req.query, req.top_k)

@app.get("/api/genai/prompt/templates", tags=["Module 3: GenAI & RAG"])
def get_prompt_templates():
    return {"templates": genai_service.prompt_templates}

@app.post("/api/genai/prompt/generate", tags=["Module 3: GenAI & RAG"])
def generate_prompt(req: PromptGenerateRequest):
    return genai_service.execute_prompt_template(
        template_id=req.template_id,
        params=req.params,
        temperature=req.temperature,
        max_tokens=req.max_tokens
    )

@app.post("/api/genai/agent/execute", tags=["Module 3: GenAI & RAG"])
def execute_autonomous_agent(req: AgentExecuteRequest):
    return genai_service.run_autonomous_agent(req.goal)

# =====================================================================
# MODULE 4: CLOUD SECURITY, CRYPTOGRAPHY & GOVERNANCE ENDPOINTS
# =====================================================================
@app.post("/api/security/kms/encrypt", tags=["Module 4: Security & Governance"])
def kms_encrypt(req: KmsEncryptRequest):
    return security_governance_service.envelope_encrypt(req.plaintext)

@app.post("/api/security/kms/decrypt", tags=["Module 4: Security & Governance"])
def kms_decrypt(req: KmsDecryptRequest):
    return security_governance_service.envelope_decrypt(
        edk_hex=req.encrypted_data_key_hex,
        ciphertext_b64=req.ciphertext_base64,
        iv_hex=req.initialization_vector_hex,
        tag_hex=req.auth_tag_hex
    )

@app.get("/api/security/iam/policies", tags=["Module 4: Security & Governance"])
def get_iam_policies():
    return {"policies": security_governance_service.iam_policies}

@app.post("/api/security/iam/evaluate", tags=["Module 4: Security & Governance"])
def evaluate_iam_action(req: IamEvaluateRequest):
    return security_governance_service.evaluate_iam_policy(role=req.role, action=req.action, resource=req.resource)

@app.get("/api/security/vpc/topology", tags=["Module 4: Security & Governance"])
def get_vpc_topology():
    return security_governance_service.vpc_topology

@app.get("/api/security/cloudtrail/events", tags=["Module 4: Security & Governance"])
def get_cloudtrail_events():
    return {"events": security_governance_service.cloudtrail_events}

@app.get("/api/security/threats/alerts", tags=["Module 4: Security & Governance"])
def get_threat_alerts():
    return {"threats": security_governance_service.threat_findings}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

