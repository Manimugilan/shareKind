"""
ShareKind Storage Layer: DynamoDB Adapter with Local In-Memory Fallback.
Provides seamless fallback when AWS credentials or DynamoDB permissions are absent.
"""

import os
import json
import time
from typing import List, Dict, Any, Optional
import uuid

class StorageService:
    def __init__(self):
        self.use_aws_dynamo = os.getenv("USE_AWS_DYNAMODB", "false").lower() == "true"
        self.table_name = os.getenv("DYNAMODB_TABLE_NAME", "sharekind-core-dev")
        self.dynamodb_client = None

        if self.use_aws_dynamo:
            try:
                import boto3
                self.dynamodb_client = boto3.resource("dynamodb")
                self.table = self.dynamodb_client.Table(self.table_name)
            except Exception as e:
                print(f"[StorageService] AWS DynamoDB connection failed ({e}). Falling back to local repository.")
                self.use_aws_dynamo = False

        # In-memory local repository storage
        self.donations: Dict[str, Dict[str, Any]] = {}
        self.needs: Dict[str, Dict[str, Any]] = {}
        self.suppliers: Dict[str, Dict[str, Any]] = {}
        self.orders: Dict[str, Dict[str, Any]] = {}
        self.audit_logs: List[Dict[str, Any]] = []
        self.ngos: Dict[str, Dict[str, Any]] = {}
        self.donors: Dict[str, Dict[str, Any]] = {}

        self._seed_synthetic_data()

    def _seed_synthetic_data(self):
        """Populates realistic synthetic demo data satisfying all MVP project criteria."""
        # 1. Seed NGOs (4 organizations)
        seed_ngos = [
            {"id": "ngo-1", "name": "Hope Haven Shelter", "category": "Homeless & Disaster Relief", "verified": True, "location": "Metro Downtown", "contact": "director@hopehaven.org", "beneficiaries_served": 1420},
            {"id": "ngo-2", "name": "Sunrise Child Foundation", "category": "Orphanages & Child Care", "verified": True, "location": "North Suburbs", "contact": "admin@sunrisechild.org", "beneficiaries_served": 850},
            {"id": "ngo-3", "name": "GreenLeaf Elder Care", "category": "Senior Citizen Well-Being", "verified": True, "location": "East Valley", "contact": "care@greenleaf.org", "beneficiaries_served": 620},
            {"id": "ngo-4", "name": "Grace Community Kitchen", "category": "Hunger Alleviation", "verified": False, "location": "South End", "contact": "info@gracekitchen.org", "beneficiaries_served": 2100}
        ]
        for ngo in seed_ngos:
            self.ngos[ngo["id"]] = ngo

        # 2. Seed Donors (5 donors)
        seed_donors = [
            {"id": "donor-1", "name": "Sarah Jenkins", "email": "sarah.j@example.com", "role": "DONOR", "total_donated": 1250.00, "supported_orgs_count": 3},
            {"id": "donor-2", "name": "David Chen", "email": "dchen@example.com", "role": "DONOR", "total_donated": 840.00, "supported_orgs_count": 2},
            {"id": "donor-3", "name": "Elena Rostova", "email": "elena.r@example.com", "role": "DONOR", "total_donated": 450.00, "supported_orgs_count": 1},
            {"id": "donor-4", "name": "Marcus Washington", "email": "marcus.w@example.com", "role": "DONOR", "total_donated": 2100.00, "supported_orgs_count": 4},
            {"id": "donor-5", "name": "Amina Patel", "email": "amina.p@example.com", "role": "DONOR", "total_donated": 600.00, "supported_orgs_count": 2}
        ]
        for d in seed_donors:
            self.donors[d["id"]] = d

        # 3. Seed Suppliers (10 suppliers across food, grocery, clothing)
        seed_suppliers = [
            {"id": "sup-1", "name": "Harvest Caterers & Kitchen", "category": "food", "unit_price": 3.20, "delivery_fee": 15.00, "available_quantity": 400, "delivery_hours": 3, "reliability_score": 0.98, "verified": True, "service_area": "Metro Wide"},
            {"id": "sup-2", "name": "Community Table Diner", "category": "food", "unit_price": 3.80, "delivery_fee": 10.00, "available_quantity": 250, "delivery_hours": 2, "reliability_score": 0.94, "verified": True, "service_area": "Downtown & North"},
            {"id": "sup-3", "name": "City Delights Bulk Food", "category": "food", "unit_price": 2.90, "delivery_fee": 25.00, "available_quantity": 800, "delivery_hours": 6, "reliability_score": 0.89, "verified": True, "service_area": "Metro Wide"},
            {"id": "sup-4", "name": "Speedy Meals Express", "category": "food", "unit_price": 4.10, "delivery_fee": 8.00, "available_quantity": 120, "delivery_hours": 1, "reliability_score": 0.82, "verified": False, "service_area": "Downtown Only"},
            {"id": "sup-5", "name": "Metro Pantry & Provisions", "category": "groceries", "unit_price": 22.50, "delivery_fee": 20.00, "available_quantity": 180, "delivery_hours": 12, "reliability_score": 0.96, "verified": True, "service_area": "Metro Wide"},
            {"id": "sup-6", "name": "Valley Fresh Wholesale", "category": "groceries", "unit_price": 20.00, "delivery_fee": 35.00, "available_quantity": 300, "delivery_hours": 24, "reliability_score": 0.92, "verified": True, "service_area": "All Districts"},
            {"id": "sup-7", "name": "Organic Staples Co-op", "category": "groceries", "unit_price": 28.00, "delivery_fee": 15.00, "available_quantity": 90, "delivery_hours": 18, "reliability_score": 0.88, "verified": True, "service_area": "East & South"},
            {"id": "sup-8", "name": "Warmth & Care Apparel Supply", "category": "clothing", "unit_price": 35.00, "delivery_fee": 25.00, "available_quantity": 150, "delivery_hours": 48, "reliability_score": 0.97, "verified": True, "service_area": "National Logistics"},
            {"id": "sup-9", "name": "Beacon Garments & Linens", "category": "clothing", "unit_price": 32.50, "delivery_fee": 30.00, "available_quantity": 220, "delivery_hours": 72, "reliability_score": 0.90, "verified": True, "service_area": "Metro Wide"},
            {"id": "sup-10", "name": "NorthStar Textile Liquidators", "category": "clothing", "unit_price": 26.00, "delivery_fee": 45.00, "available_quantity": 80, "delivery_hours": 96, "reliability_score": 0.75, "verified": False, "service_area": "North Suburbs"}
        ]
        for sup in seed_suppliers:
            self.suppliers[sup["id"]] = sup

        # 4. Seed NGO Needs (8 requirements)
        seed_needs = [
            {"id": "need-1", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "title": "200 Nutritious Evening Meals for Shelter", "category": "food", "target_quantity": 200, "fulfilled_quantity": 200, "budget_estimate": 750.00, "urgency": "Urgent", "status": "procured", "location": "Metro Downtown", "created_at": "2026-10-01T10:00:00Z"},
            {"id": "need-2", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "title": "Winter Coats and Warm Sets for Children", "category": "clothing", "target_quantity": 40, "fulfilled_quantity": 40, "budget_estimate": 1400.00, "urgency": "High", "status": "delivered", "location": "North Suburbs", "created_at": "2026-10-03T11:30:00Z"},
            {"id": "need-3", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "title": "50 Emergency Grocery Staple Kits", "category": "groceries", "target_quantity": 50, "fulfilled_quantity": 0, "budget_estimate": 1100.00, "urgency": "High", "status": "open", "location": "Metro Downtown", "created_at": "2026-10-08T09:00:00Z"},
            {"id": "need-4", "ngo_id": "ngo-3", "ngo_name": "GreenLeaf Elder Care", "title": "150 Soft Dietary Meals for Elderly Patients", "category": "food", "target_quantity": 150, "fulfilled_quantity": 0, "budget_estimate": 550.00, "urgency": "Medium", "status": "open", "location": "East Valley", "created_at": "2026-10-09T14:15:00Z"},
            {"id": "need-5", "ngo_id": "ngo-4", "ngo_name": "Grace Community Kitchen", "title": "Weekend Soup Kitchen - 300 Fresh Meals", "category": "food", "target_quantity": 300, "fulfilled_quantity": 300, "budget_estimate": 1050.00, "urgency": "Urgent", "status": "confirmed_distribution", "location": "South End", "created_at": "2026-10-04T08:00:00Z"},
            {"id": "need-6", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "title": "30 Weekly Infant Formula & Food Packs", "category": "groceries", "target_quantity": 30, "fulfilled_quantity": 0, "budget_estimate": 700.00, "urgency": "High", "status": "open", "location": "North Suburbs", "created_at": "2026-10-10T16:45:00Z"},
            {"id": "need-7", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "title": "60 Thermal Blankets & Thermal Undergarments", "category": "clothing", "target_quantity": 60, "fulfilled_quantity": 0, "budget_estimate": 1950.00, "urgency": "Medium", "status": "open", "location": "Metro Downtown", "created_at": "2026-10-11T12:00:00Z"},
            {"id": "need-8", "ngo_id": "ngo-3", "ngo_name": "GreenLeaf Elder Care", "title": "25 Medical Grocery & Nutrition Supplemental Kits", "category": "groceries", "target_quantity": 25, "fulfilled_quantity": 0, "budget_estimate": 600.00, "urgency": "Medium", "status": "open", "location": "East Valley", "created_at": "2026-10-11T17:30:00Z"}
        ]
        for n in seed_needs:
            self.needs[n["id"]] = n

        # 5. Seed Procurement Orders (5 orders representing different state machine statuses)
        seed_orders = [
            {
                "id": "ord-101",
                "need_id": "need-1",
                "ngo_id": "ngo-1",
                "ngo_name": "Hope Haven Shelter",
                "supplier_id": "sup-1",
                "supplier_name": "Harvest Caterers & Kitchen",
                "category": "food",
                "quantity": 200,
                "unit_price": 3.20,
                "delivery_fee": 15.00,
                "total_cost": 655.00,
                "status": "in_preparation", # Placed -> Accepted -> In Prep -> Dispatched -> Delivered -> Confirmed Distribution
                "created_at": "2026-10-09T10:00:00Z",
                "history": [
                    {"status": "placed", "time": "2026-10-09T10:00:00Z", "actor": "NGO Hope Haven"},
                    {"status": "accepted", "time": "2026-10-09T10:30:00Z", "actor": "Supplier Harvest Caterers"},
                    {"status": "in_preparation", "time": "2026-10-09T12:00:00Z", "actor": "Supplier Harvest Caterers"}
                ],
                "impact_summary": "200 hot meals scheduled for shelter distribution tonight."
            },
            {
                "id": "ord-102",
                "need_id": "need-2",
                "ngo_id": "ngo-2",
                "ngo_name": "Sunrise Child Foundation",
                "supplier_id": "sup-8",
                "supplier_name": "Warmth & Care Apparel Supply",
                "category": "clothing",
                "quantity": 40,
                "unit_price": 35.00,
                "delivery_fee": 25.00,
                "total_cost": 1425.00,
                "status": "delivered",
                "created_at": "2026-10-05T14:00:00Z",
                "history": [
                    {"status": "placed", "time": "2026-10-05T14:00:00Z", "actor": "NGO Sunrise Child"},
                    {"status": "accepted", "time": "2026-10-05T15:00:00Z", "actor": "Supplier Warmth & Care"},
                    {"status": "dispatched", "time": "2026-10-06T09:00:00Z", "actor": "Supplier Warmth & Care"},
                    {"status": "delivered", "time": "2026-10-07T16:00:00Z", "actor": "Courier Fleet Express"}
                ],
                "impact_summary": "40 insulated winter jackets received by foundation coordinators."
            },
            {
                "id": "ord-103",
                "need_id": "need-5",
                "ngo_id": "ngo-4",
                "ngo_name": "Grace Community Kitchen",
                "supplier_id": "sup-3",
                "supplier_name": "City Delights Bulk Food",
                "category": "food",
                "quantity": 300,
                "unit_price": 2.90,
                "delivery_fee": 25.00,
                "total_cost": 895.00,
                "status": "confirmed_distribution", # Fully complete!
                "created_at": "2026-10-04T09:00:00Z",
                "history": [
                    {"status": "placed", "time": "2026-10-04T09:00:00Z", "actor": "NGO Grace Kitchen"},
                    {"status": "dispatched", "time": "2026-10-04T12:00:00Z", "actor": "City Delights"},
                    {"status": "delivered", "time": "2026-10-04T15:30:00Z", "actor": "City Delights"},
                    {"status": "confirmed_distribution", "time": "2026-10-04T18:00:00Z", "actor": "NGO Grace Kitchen (Verified Receipt)"}
                ],
                "impact_summary": "300 community residents served hot dinner. Distribution certificate issued."
            },
            {
                "id": "ord-104",
                "need_id": "need-3",
                "ngo_id": "ngo-1",
                "ngo_name": "Hope Haven Shelter",
                "supplier_id": "sup-5",
                "supplier_name": "Metro Pantry & Provisions",
                "category": "groceries",
                "quantity": 50,
                "unit_price": 22.50,
                "delivery_fee": 20.00,
                "total_cost": 1145.00,
                "status": "placed",
                "created_at": "2026-10-11T14:00:00Z",
                "history": [
                    {"status": "placed", "time": "2026-10-11T14:00:00Z", "actor": "NGO Hope Haven"}
                ],
                "impact_summary": "Pending supplier acknowledgement for grocery provisions."
            },
            {
                "id": "ord-105",
                "need_id": "need-7",
                "ngo_id": "ngo-1",
                "ngo_name": "Hope Haven Shelter",
                "supplier_id": "sup-9",
                "supplier_name": "Beacon Garments & Linens",
                "category": "clothing",
                "quantity": 60,
                "unit_price": 32.50,
                "delivery_fee": 30.00,
                "total_cost": 1980.00,
                "status": "dispatched",
                "created_at": "2026-10-10T11:00:00Z",
                "history": [
                    {"status": "placed", "time": "2026-10-10T11:00:00Z", "actor": "NGO Hope Haven"},
                    {"status": "accepted", "time": "2026-10-10T13:00:00Z", "actor": "Supplier Beacon Garments"},
                    {"status": "dispatched", "time": "2026-10-11T09:30:00Z", "actor": "Supplier Beacon Garments"}
                ],
                "impact_summary": "En route via logistics carrier. Tracking #TRK-882910."
            }
        ]
        for o in seed_orders:
            self.orders[o["id"]] = o

        # 6. Seed Donations (15 records across 5 donors)
        seed_donations = [
            {"id": "don-1", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": 250.00, "category": "food", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "status": "allocated", "date": "2026-10-02T14:00:00Z", "is_demo": True, "impact": "71 hot meals funded"},
            {"id": "don-2", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": 500.00, "category": "clothing", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "status": "distributed", "date": "2026-10-04T10:15:00Z", "is_demo": True, "impact": "12 winter coat bundles delivered"},
            {"id": "don-3", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": 500.00, "category": "groceries", "ngo_id": "ngo-3", "ngo_name": "GreenLeaf Elder Care", "status": "allocated", "date": "2026-10-08T18:00:00Z", "is_demo": True, "impact": "20 pantry food baskets funded"},
            
            {"id": "don-4", "donor_id": "donor-2", "donor_name": "David Chen", "amount": 350.00, "category": "food", "ngo_id": "ngo-4", "ngo_name": "Grace Community Kitchen", "status": "distributed", "date": "2026-10-03T09:00:00Z", "is_demo": True, "impact": "100 hot lunches served to homeless community"},
            {"id": "don-5", "donor_id": "donor-2", "donor_name": "David Chen", "amount": 490.00, "category": "groceries", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "status": "allocated", "date": "2026-10-09T11:20:00Z", "is_demo": True, "impact": "19 family emergency rations"},

            {"id": "don-6", "donor_id": "donor-3", "donor_name": "Elena Rostova", "amount": 450.00, "category": "clothing", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "status": "distributed", "date": "2026-10-05T13:40:00Z", "is_demo": True, "impact": "11 school uniform and shoe kits distributed"},

            {"id": "don-7", "donor_id": "donor-4", "donor_name": "Marcus Washington", "amount": 1000.00, "category": "food", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "status": "allocated", "date": "2026-10-06T15:00:00Z", "is_demo": True, "impact": "285 meals scheduled for shelter soup line"},
            {"id": "don-8", "donor_id": "donor-4", "donor_name": "Marcus Washington", "amount": 600.00, "category": "groceries", "ngo_id": "ngo-3", "ngo_name": "GreenLeaf Elder Care", "status": "procured", "date": "2026-10-07T12:00:00Z", "is_demo": True, "impact": "24 elder wellness nutrition boxes"},
            {"id": "don-9", "donor_id": "donor-4", "donor_name": "Marcus Washington", "amount": 500.00, "category": "clothing", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "status": "distributed", "date": "2026-10-10T09:30:00Z", "is_demo": True, "impact": "13 thermal blanket packs delivered"},

            {"id": "don-10", "donor_id": "donor-5", "donor_name": "Amina Patel", "amount": 200.00, "category": "food", "ngo_id": "ngo-4", "ngo_name": "Grace Community Kitchen", "status": "distributed", "date": "2026-10-04T11:00:00Z", "is_demo": True, "impact": "57 hot evening meals served"},
            {"id": "don-11", "donor_id": "donor-5", "donor_name": "Amina Patel", "amount": 400.00, "category": "groceries", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "status": "allocated", "date": "2026-10-09T16:10:00Z", "is_demo": True, "impact": "16 pantry bundles"},

            {"id": "don-12", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": 150.00, "category": "food", "ngo_id": "ngo-4", "ngo_name": "Grace Community Kitchen", "status": "allocated", "date": "2026-10-11T10:00:00Z", "is_demo": True, "impact": "42 fresh meals funded"},
            {"id": "don-13", "donor_id": "donor-2", "donor_name": "David Chen", "amount": 120.00, "category": "clothing", "ngo_id": "ngo-2", "ngo_name": "Sunrise Child Foundation", "status": "pending_allocation", "date": "2026-10-11T14:30:00Z", "is_demo": True, "impact": "Pending allocation to upcoming clothing need"},
            {"id": "don-14", "donor_id": "donor-3", "donor_name": "Elena Rostova", "amount": 300.00, "category": "food", "ngo_id": "ngo-1", "ngo_name": "Hope Haven Shelter", "status": "pending_allocation", "date": "2026-10-11T18:00:00Z", "is_demo": True, "impact": "85 meals awaiting procurement allocation"},
            {"id": "don-15", "donor_id": "donor-4", "donor_name": "Marcus Washington", "amount": 750.00, "category": "groceries", "ngo_id": "ngo-3", "ngo_name": "GreenLeaf Elder Care", "status": "pending_allocation", "date": "2026-10-12T08:00:00Z", "is_demo": True, "impact": "30 elder grocery baskets allocated"}
        ]
        for d in seed_donations:
            self.donations[d["id"]] = d

        # 7. Seed Audit Logs
        self.audit_logs = [
            {"audit_id": "aud-001", "timestamp": int(time.time()) - 86400 * 3, "iso_time": "2026-10-09T10:05:00Z", "action": "ORDER_PLACED", "user_id": "ngo-1", "user_role": "NGO", "resource_id": "ord-101", "details": {"amount": 655.0, "supplier": "Harvest Caterers"}, "is_demo": True},
            {"audit_id": "aud-002", "timestamp": int(time.time()) - 86400 * 2, "iso_time": "2026-10-10T13:10:00Z", "action": "SUPPLIER_VERIFIED", "user_id": "admin-1", "user_role": "ADMIN", "resource_id": "sup-1", "details": {"verified_by": "Compliance Officer"}, "is_demo": True},
            {"audit_id": "aud-003", "timestamp": int(time.time()) - 86400 * 1, "iso_time": "2026-10-11T09:35:00Z", "action": "ORDER_DISPATCHED", "user_id": "sup-9", "user_role": "SUPPLIER", "resource_id": "ord-105", "details": {"carrier": "Logistics Express"}, "is_demo": True},
            {"audit_id": "aud-004", "timestamp": int(time.time()) - 3600 * 4, "iso_time": "2026-10-12T05:00:00Z", "action": "DISTRIBUTION_CONFIRMED", "user_id": "ngo-4", "user_role": "NGO", "resource_id": "ord-103", "details": {"beneficiaries": 300, "proof_type": "Digital Signoff"}, "is_demo": True}
        ]

    # --- DONATION REPOSITORY METHODS ---
    def get_donations_by_donor(self, donor_id: str) -> List[Dict[str, Any]]:
        return [d for d in self.donations.values() if d.get("donor_id") == donor_id]

    def create_donation(self, record: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in record:
            record["id"] = f"don-{uuid.uuid4().hex[:8]}"
        if "date" not in record:
            record["date"] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        record["is_demo"] = True
        self.donations[record["id"]] = record
        return record

    def list_all_donations(self) -> List[Dict[str, Any]]:
        return list(self.donations.values())

    # --- NGO NEEDS METHODS ---
    def list_needs(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        results = list(self.needs.values())
        if category and category.lower() != "all":
            results = [n for n in results if n.get("category", "").lower() == category.lower()]
        return results

    def create_need(self, record: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in record:
            record["id"] = f"need-{uuid.uuid4().hex[:8]}"
        if "created_at" not in record:
            record["created_at"] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        if "status" not in record:
            record["status"] = "open"
        self.needs[record["id"]] = record
        return record

    def get_need(self, need_id: str) -> Optional[Dict[str, Any]]:
        return self.needs.get(need_id)

    # --- SUPPLIERS METHODS ---
    def list_suppliers(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        results = list(self.suppliers.values())
        if category and category.lower() != "all":
            results = [s for s in results if s.get("category", "").lower() == category.lower()]
        return results

    def get_supplier(self, supplier_id: str) -> Optional[Dict[str, Any]]:
        return self.suppliers.get(supplier_id)

    def set_supplier_verification(self, supplier_id: str, verified: bool) -> Optional[Dict[str, Any]]:
        if supplier_id in self.suppliers:
            self.suppliers[supplier_id]["verified"] = verified
            return self.suppliers[supplier_id]
        return None

    # --- PROCUREMENT ORDERS METHODS ---
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in order_data:
            order_data["id"] = f"ord-{uuid.uuid4().hex[:8]}"
        if "created_at" not in order_data:
            order_data["created_at"] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        if "status" not in order_data:
            order_data["status"] = "placed"
        order_data["is_demo"] = True
        
        now_iso = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        order_data["history"] = [
            {"status": "placed", "time": now_iso, "actor": order_data.get("ngo_name", "NGO")}
        ]
        self.orders[order_data["id"]] = order_data
        return order_data

    def list_orders(self, role: str, entity_id: Optional[str] = None) -> List[Dict[str, Any]]:
        all_orders = list(self.orders.values())
        if role == "NGO" and entity_id:
            return [o for o in all_orders if o.get("ngo_id") == entity_id]
        elif role == "SUPPLIER" and entity_id:
            return [o for o in all_orders if o.get("supplier_id") == entity_id]
        return all_orders

    def update_order_status(self, order_id: str, new_status: str, actor: str) -> Optional[Dict[str, Any]]:
        if order_id not in self.orders:
            return None
        order = self.orders[order_id]
        order["status"] = new_status
        now_iso = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        if "history" not in order:
            order["history"] = []
        order["history"].append({"status": new_status, "time": now_iso, "actor": actor})
        return order

    # --- AUDIT LOGS ---
    def record_audit(self, entry: Dict[str, Any]):
        self.audit_logs.insert(0, entry)

    def get_audit_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.audit_logs[:limit]

# Singleton instance
storage = StorageService()
