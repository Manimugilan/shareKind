#!/usr/bin/env python3
"""
Seed DynamoDB Table with Decimal-compatible records
"""
import os, boto3
from decimal import Decimal

env = {}
with open('aws/.env') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

session = boto3.Session(
    aws_access_key_id=env['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=env['AWS_SECRET_ACCESS_KEY'],
    aws_session_token=env['AWS_SESSION_TOKEN'],
    region_name=env['AWS_DEFAULT_REGION']
)

dynamodb = session.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('sharekind-core-dev')

records = [
    {"PK": "DONOR#donor-1", "SK": "METADATA", "id": "donor-1", "name": "Sarah Jenkins", "email": "sarah.j@example.com", "total_donated": Decimal("1250.00"), "role": "DONOR"},
    {"PK": "DONOR#donor-2", "SK": "METADATA", "id": "donor-2", "name": "David Chen", "email": "dchen@example.com", "total_donated": Decimal("840.00"), "role": "DONOR"},
    {"PK": "DONOR#donor-3", "SK": "METADATA", "id": "donor-3", "name": "Elena Rostova", "email": "elena.r@example.com", "total_donated": Decimal("450.00"), "role": "DONOR"},
    {"PK": "DONOR#donor-4", "SK": "METADATA", "id": "donor-4", "name": "Marcus Washington", "email": "marcus.w@example.com", "total_donated": Decimal("2100.00"), "role": "DONOR"},
    {"PK": "DONOR#donor-5", "SK": "METADATA", "id": "donor-5", "name": "Amina Patel", "email": "amina.p@example.com", "total_donated": Decimal("600.00"), "role": "DONOR"},
    
    {"PK": "NGO#ngo-1", "SK": "METADATA", "id": "ngo-1", "name": "Hope Haven Shelter", "category": "Homeless & Disaster Relief", "verified": True, "location": "Metro Downtown"},
    {"PK": "NGO#ngo-2", "SK": "METADATA", "id": "ngo-2", "name": "Sunrise Child Foundation", "category": "Orphanages & Child Care", "verified": True, "location": "North Suburbs"},
    {"PK": "NGO#ngo-3", "SK": "METADATA", "id": "ngo-3", "name": "GreenLeaf Elder Care", "category": "Senior Citizen Well-Being", "verified": True, "location": "East Valley"},
    {"PK": "NGO#ngo-4", "SK": "METADATA", "id": "ngo-4", "name": "Grace Community Kitchen", "category": "Hunger Alleviation", "verified": False, "location": "South End"},

    {"PK": "SUPPLIER#sup-1", "SK": "METADATA", "id": "sup-1", "name": "Harvest Caterers", "category": "food", "unit_price": Decimal("3.20"), "delivery_fee": Decimal("15.00"), "available_quantity": 400, "reliability": Decimal("0.98"), "verified": True},
    {"PK": "SUPPLIER#sup-2", "SK": "METADATA", "id": "sup-2", "name": "Community Table Diner", "category": "food", "unit_price": Decimal("3.80"), "delivery_fee": Decimal("10.00"), "available_quantity": 250, "reliability": Decimal("0.94"), "verified": True},
    {"PK": "SUPPLIER#sup-5", "SK": "METADATA", "id": "sup-5", "name": "Metro Pantry & Provisions", "category": "groceries", "unit_price": Decimal("22.50"), "delivery_fee": Decimal("20.00"), "available_quantity": 180, "reliability": Decimal("0.96"), "verified": True},
    {"PK": "SUPPLIER#sup-8", "SK": "METADATA", "id": "sup-8", "name": "Warmth & Care Apparel Supply", "category": "clothing", "unit_price": Decimal("35.00"), "delivery_fee": Decimal("25.00"), "available_quantity": 150, "reliability": Decimal("0.97"), "verified": True},

    {"PK": "NEED#need-1", "SK": "METADATA", "id": "need-1", "ngo_id": "ngo-1", "title": "200 Nutritious Evening Meals for Shelter", "category": "food", "target_quantity": 200, "budget_estimate": Decimal("750.00"), "status": "procured"},
    {"PK": "NEED#need-2", "SK": "METADATA", "id": "need-2", "ngo_id": "ngo-2", "title": "Winter Coats and Warm Sets for Children", "category": "clothing", "target_quantity": 40, "budget_estimate": Decimal("1400.00"), "status": "delivered"},
    {"PK": "NEED#need-3", "SK": "METADATA", "id": "need-3", "ngo_id": "ngo-1", "title": "50 Emergency Grocery Staple Kits", "category": "groceries", "target_quantity": 50, "budget_estimate": Decimal("1100.00"), "status": "open"},

    {"PK": "ORDER#ord-101", "SK": "METADATA", "id": "ord-101", "supplier_name": "Harvest Caterers", "quantity": 200, "total_cost": Decimal("655.00"), "status": "in_preparation"},
    {"PK": "ORDER#ord-102", "SK": "METADATA", "id": "ord-102", "supplier_name": "Warmth & Care Apparel", "quantity": 40, "total_cost": Decimal("1425.00"), "status": "delivered"},
    {"PK": "ORDER#ord-103", "SK": "METADATA", "id": "ord-103", "supplier_name": "City Delights", "quantity": 300, "total_cost": Decimal("895.00"), "status": "confirmed_distribution"},

    {"PK": "DONATION#don-1", "SK": "DATE#2026-10-02", "id": "don-1", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": Decimal("250.00"), "category": "food", "status": "allocated", "impact": "71 hot meals funded"},
    {"PK": "DONATION#don-2", "SK": "DATE#2026-10-04", "id": "don-2", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": Decimal("500.00"), "category": "clothing", "status": "delivered", "impact": "12 winter coat bundles delivered"},
    {"PK": "DONATION#don-3", "SK": "DATE#2026-10-08", "id": "don-3", "donor_id": "donor-1", "donor_name": "Sarah Jenkins", "amount": Decimal("500.00"), "category": "groceries", "status": "allocated", "impact": "20 pantry food baskets funded"}
]

with table.batch_writer() as batch:
    for r in records:
        batch.put_item(Item=r)

print(f"SUCCESS: Seeded {len(records)} verified records directly into AWS DynamoDB table 'sharekind-core-dev'!")
