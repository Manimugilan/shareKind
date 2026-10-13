#!/usr/bin/env python3
"""
Generate clean, professional BLACK AND WHITE architectural and activity diagrams
matching the exact formatting of the sample evaluation report:
- Pure white background (#FFFFFF)
- Pure black rectangular boxes with solid black borders (#000000)
- Crisp black text (#000000)
- Pure black connection arrows and downward flow
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("report", exist_ok=True)

def generate_bw_architecture():
    fig, ax = plt.subplots(figsize=(8.5, 9.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 12)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    # Border frame
    # Layer 1: Presentation Layer
    p1 = patches.Rectangle((0.8, 9.8), 8.4, 1.6, fill=False, edgecolor='black', linewidth=1.5)
    ax.add_patch(p1)
    ax.text(5.0, 11.0, "PRESENTATION LAYER", fontsize=11, fontweight='bold', ha='center', color='black')
    
    b_user = patches.Rectangle((1.2, 10.0), 3.4, 0.8, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_user)
    ax.text(2.9, 10.4, "END USERS\n(Donor, NGO, Supplier, Admin)", fontsize=8.5, ha='center', va='center', color='black')

    b_spa = patches.Rectangle((5.4, 10.0), 3.4, 0.8, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_spa)
    ax.text(7.1, 10.4, "S3 WEB HOSTING (REACT SPA)\n(Vite, Tailwind, 4-Module Hub)", fontsize=8.5, ha='center', va='center', color='black')

    # Down arrow
    ax.annotate("", xy=(5.0, 8.8), xytext=(5.0, 9.8),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.5))
    ax.text(5.2, 9.3, "HTTPS TLS 1.3 / API Gateway (Port 8000)", fontsize=8, color='black', ha='left')

    # Layer 2: Application & Microservices Layer
    p2 = patches.Rectangle((0.8, 4.4), 8.4, 4.4, fill=False, edgecolor='black', linewidth=1.5)
    ax.add_patch(p2)
    ax.text(5.0, 8.4, "APPLICATION LAYER (AWS EC2 & LAMBDA MICROSERVICES)", fontsize=10.5, fontweight='bold', ha='center', color='black')

    # Sub-boxes in App Layer
    b_auth = patches.Rectangle((1.2, 6.4), 3.6, 1.6, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_auth)
    ax.text(3.0, 7.6, "AUTH & GOVERNANCE MODULE", fontsize=8.5, fontweight='bold', ha='center', color='black')
    ax.text(3.0, 6.9, "• Cognito User Pool (JWT)\n• RBAC Policy Evaluator\n• Private Donor Isolation", fontsize=8, ha='center', va='center', color='black')

    b_eng = patches.Rectangle((5.2, 6.4), 3.6, 1.6, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_eng)
    ax.text(7.0, 7.6, "SECURITY & KMS ENGINES", fontsize=8.5, fontweight='bold', ha='center', color='black')
    ax.text(7.0, 6.9, "• AWS KMS Envelope Encryption\n• AES-256-GCM Cryptography\n• CloudTrail / GuardDuty", fontsize=8, ha='center', va='center', color='black')

    b_core = patches.Rectangle((1.2, 4.7), 3.6, 1.4, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_core)
    ax.text(3.0, 5.7, "CORE MICROSERVICES ROUTING", fontsize=8.5, fontweight='bold', ha='center', color='black')
    ax.text(3.0, 5.1, "• Donations & Needs API\n• Supplier Catalog & Orders\n• Step Functions FSM", fontsize=8, ha='center', va='center', color='black')

    b_ai = patches.Rectangle((5.2, 4.7), 3.6, 1.4, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_ai)
    ax.text(7.0, 5.7, "AI & COGNITIVE ENGINES", fontsize=8.5, fontweight='bold', ha='center', color='black')
    ax.text(7.0, 5.1, "• Claude 3.5 / Bedrock RAG\n• 32-D Vector Knowledge Base\n• Autonomous ReAct Copilot", fontsize=8, ha='center', va='center', color='black')

    # Down arrow
    ax.annotate("", xy=(5.0, 3.4), xytext=(5.0, 4.4),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.5))
    ax.text(5.2, 3.9, "VPC Endpoints & Internal Subnets", fontsize=8, color='black', ha='left')

    # Layer 3: Data & Storage Layer
    p3 = patches.Rectangle((0.8, 0.6), 8.4, 2.8, fill=False, edgecolor='black', linewidth=1.5)
    ax.add_patch(p3)
    ax.text(5.0, 3.0, "DATA AND ANALYTICS LAYER", fontsize=10.5, fontweight='bold', ha='center', color='black')

    b_dnd = patches.Rectangle((1.2, 1.0), 2.3, 1.6, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_dnd)
    ax.text(2.35, 2.2, "AMAZON DYNAMODB", fontsize=8, fontweight='bold', ha='center', color='black')
    ax.text(2.35, 1.5, "Single-Table Core\n(sharekind-core-dev)\n22 Seed Records", fontsize=7.5, ha='center', va='center', color='black')

    b_s3 = patches.Rectangle((3.8, 1.0), 2.4, 1.6, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_s3)
    ax.text(5.0, 2.2, "S3 ANALYTICS LAKE", fontsize=8, fontweight='bold', ha='center', color='black')
    ax.text(5.0, 1.5, "Partitioned Lake\nSnappy Parquet\nPySpark Windowed ETL", fontsize=7.5, ha='center', va='center', color='black')

    b_red = patches.Rectangle((6.5, 1.0), 2.3, 1.6, fill=False, edgecolor='black', linewidth=1.2)
    ax.add_patch(b_red)
    ax.text(7.65, 2.2, "ATHENA & REDSHIFT", fontsize=8, fontweight='bold', ha='center', color='black')
    ax.text(7.65, 1.5, "Glue Data Catalog\nPresto SQL Engine\nStar Schema DWH", fontsize=7.5, ha='center', va='center', color='black')

    plt.tight_layout()
    out = "report/bw_system_architecture.png"
    plt.savefig(out, dpi=300, bbox_inches='tight', facecolor='#ffffff')
    plt.close()
    print(f"Created: {out}")

def generate_bw_flowchart(steps, title, out_path, is_branching=False):
    """Generates standard academic black-and-white vertical flowchart."""
    n = len(steps)
    fig_height = max(7.0, n * 0.9 + 1.2)
    fig, ax = plt.subplots(figsize=(6.5, fig_height), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, n * 1.5 + 1.5)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    y = n * 1.5 + 0.8
    y_start = y

    for i, step in enumerate(steps):
        # Draw box
        box_w = 6.2
        box_h = 0.8
        bx = (10 - box_w) / 2
        
        # Check if Start or End
        if step.upper() in ["START", "END"]:
            # Oval/rounded
            rect = patches.FancyBboxPatch((bx + 1.5, y - box_h), box_w - 3.0, box_h,
                                          boxstyle="round,pad=0.1", fill=False, edgecolor='black', linewidth=1.5)
        else:
            rect = patches.Rectangle((bx, y - box_h), box_w, box_h, fill=False, edgecolor='black', linewidth=1.4)
            
        ax.add_patch(rect)
        ax.text(5.0, y - box_h / 2, step, fontsize=8.5, ha='center', va='center', color='black', wrap=True)

        # Arrow to next
        if i < n - 1:
            ax.annotate("", xy=(5.0, y - box_h - 0.7), xytext=(5.0, y - box_h),
                        arrowprops=dict(arrowstyle="->", color="black", lw=1.5))
        y -= 1.5

    plt.tight_layout()
    plt.savefig(out_path, dpi=300, bbox_inches='tight', facecolor='#ffffff')
    plt.close()
    print(f"Created: {out_path}")

def main():
    generate_bw_architecture()

    # Flowchart 1: Data Engineering
    steps_data = [
        "START",
        "EC2 INSTANCE PROVISIONING",
        "CONNECT SSH & HARDEN OS",
        "DATABASE SCHEMA & MODELS (DYNAMODB / POSTGRES)",
        "CONFIG BOTO3 & FASTAPI DATA LAYER",
        "EXECUTE SEED_DYNAMO.PY (22 VERIFIED RECORDS)",
        "PREPROCESS & VERSION MACHINE LEARNING DATA",
        "CHECK DATA INTEGRITY & DECIMAL CONSTRAINTS",
        "VALIDATE S3 ANALYTICS LAKE PARTITIONING",
        "END"
    ]
    generate_bw_flowchart(steps_data, "Activity Diagram for Data Engineering Module", "report/bw_activity_diagram_data.png")

    # Flowchart 2: Cloud Platform Engineering
    steps_cloud = [
        "START",
        "LAUNCH EC2 INSTANCE (UBUNTU / AMAZON LINUX)",
        "CONFIG SECURITY GROUPS (PORT 22, 80, 8000)",
        "CONNECT VIA SSH TERMINAL",
        "INSTALL DEPENDENCIES (FASTAPI, BOTO3, UVICORN)",
        "DEPLOY AWS LAMBDA MICROSERVICES WITH LABROLE",
        "SETUP S3 STATIC WEBSITE HOSTING (REACT SPA)",
        "CONFIGURE AWS STEP FUNCTIONS FSM WORKFLOW",
        "EXECUTE GITHUB ACTIONS CI/CD SYNC PIPELINE",
        "TEST API ENDPOINT (/health) ON PORT 8000",
        "END"
    ]
    generate_bw_flowchart(steps_cloud, "Activity Diagram for Cloud Engineering Module", "report/bw_activity_diagram_cloud.png")

    # Flowchart 3: AI Engineering
    steps_ai = [
        "START",
        "LAUNCH EC2 & LOAD AI DEPENDENCIES",
        "INSTALL SCIKIT-LEARN, NUMPY, PANDAS, BEDROCK SDK",
        "RUN OFFLINE DEMAND FORECAST TRAINING MODEL",
        "BUILD TF-IDF FEATURE VECTORIZER & CATEGORY MODEL",
        "INITIALIZE 32-DIMENSIONAL DENSE VECTOR EMBEDDINGS",
        "LOAD MODELS & CONFIGURE BEDROCK CLAUDE 3.5 CLIENT",
        "EXECUTE AUTONOMOUS REACT AGENT LOOP (THOUGHT -> ACTION)",
        "PERFORM REAL-TIME INFERENCE & CITATION AUDIT",
        "VALIDATE 0.0% HALLUCINATION & LATENCY BENCHMARKS",
        "END"
    ]
    generate_bw_flowchart(steps_ai, "Activity Diagram for AI Engineering Module", "report/bw_activity_diagram_ai.png")

    # Flowchart 4: Security Engineering
    steps_security = [
        "START",
        "CONFIGURE USER AUTHENTICATION & COGNITO RBAC",
        "IMPLEMENT AWS KMS ENVELOPE ENCRYPTION (AES-256-GCM)",
        "GENERATE PLAINTEXT DATA KEYS & SCRUB RAM",
        "CONFIGURE AWS EC2 SECURITY GROUPS & FIREWALL",
        "HARDEN UBUNTU SERVER (UFW RULES & NO ROOT SSH)",
        "ENFORCE PRIVATE DONOR ISOLATION BYLAWS",
        "SEGMENT MULTI-AZ AMAZON VPC (6 SUBNETS, 2 AZS)",
        "ENABLE CLOUDTRAIL AUDITING & GUARDDUTY THREAT ALARMS",
        "VALIDATE END-TO-END CRYPTOGRAPHIC INTEGRITY",
        "END"
    ]
    generate_bw_flowchart(steps_security, "Activity Diagram for Security Engineering Module", "report/bw_activity_diagram_security.png")

if __name__ == "__main__":
    main()
