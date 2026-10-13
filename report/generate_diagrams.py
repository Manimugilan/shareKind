#!/usr/bin/env python3
"""
Generate professional architectural and activity diagrams for ShareKind Wipro CPPE modules.
Covers:
- Figure 3.1: Complete Cloud & AI System Architecture
- Figure 4.1.1: Module 1 Activity Diagram (Cloud Product & Platform Engineering)
- Figure 4.2.1: Module 2 Activity Diagram (Data Engineering, Big Data & ML Insights)
- Figure 4.3.1: Module 3 Activity Diagram (Generative AI, Foundation Models & RAG)
- Figure 4.4.1: Module 4 Activity Diagram (Cloud Security, Cryptography & Governance)
"""
import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("report", exist_ok=True)

def create_system_architecture():
    fig, ax = plt.subplots(figsize=(10, 13), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(5, 13.6, "Figure 3.1 ShareKind Cloud Platform & AI System Architecture", fontsize=13, fontweight='bold', ha='center', color='#0f172a')

    # Layer 1: Client Layer
    rect_pres = patches.FancyBboxPatch((0.5, 11.2), 9, 2.0, boxstyle="round,pad=0.2", ec="#38bdf8", fc="#e0f2fe", lw=2)
    ax.add_patch(rect_pres)
    ax.text(5, 12.8, "PRESENTATION LAYER (CLIENT)", fontsize=11, fontweight='bold', ha='center', color='#0369a1')
    
    sub_user = patches.FancyBboxPatch((1.0, 11.5), 3.5, 0.9, boxstyle="round,pad=0.1", ec="#94a3b8", fc="#ffffff", lw=1.5)
    ax.add_patch(sub_user)
    ax.text(2.75, 12.05, "END USERS\n(Donor, NGO, Supplier, Admin)", fontsize=8.5, ha='center', va='center', fontweight='bold', color='#1e293b')

    sub_spa = patches.FancyBboxPatch((5.5, 11.5), 3.5, 0.9, boxstyle="round,pad=0.1", ec="#0d9488", fc="#f0fdfa", lw=1.5)
    ax.add_patch(sub_spa)
    ax.text(7.25, 12.05, "REACT VITE SPA / S3 HOSTING\n(Tailwind CSS, 4 Module Engineering Hub)", fontsize=8.5, ha='center', va='center', fontweight='bold', color='#0f766e')

    ax.annotate("", xy=(5, 10.3), xytext=(5, 11.2),
                arrowprops=dict(arrowstyle="<|-|>", color="#0284c7", lw=2.5, shrinkA=5, shrinkB=5))
    ax.text(5.2, 10.7, "HTTPS / TLS 1.3 (Amazon API Gateway & Cognito)", fontsize=8, color="#0369a1", fontweight='bold')

    # Layer 2: Compute & Modules Layer
    rect_app = patches.FancyBboxPatch((0.5, 5.0), 9, 5.2, boxstyle="round,pad=0.2", ec="#6366f1", fc="#f5f3ff", lw=2)
    ax.add_patch(rect_app)
    ax.text(5, 9.9, "APPLICATION & MICROSERVICES LAYER (AWS EC2 / LAMBDA / STEP FUNCTIONS)", fontsize=11, fontweight='bold', ha='center', color='#4338ca')

    # 4 Modules Grid
    # Mod 1
    m1 = patches.FancyBboxPatch((0.9, 7.3), 3.9, 2.1, boxstyle="round,pad=0.1", ec="#3b82f6", fc="#eff6ff", lw=1.5)
    ax.add_patch(m1)
    ax.text(2.85, 9.0, "Module 1: Platform Engineering", fontsize=8.5, fontweight='bold', ha='center', color='#1e40af')
    ax.text(2.85, 8.2, "• AWS Lambda Microservices\n• Amazon API Gateway Routing\n• AWS Step Functions FSM\n• GitHub Actions CI/CD Pipeline", fontsize=7.2, ha='center', va='center', color='#1e3a8a')

    # Mod 2
    m2 = patches.FancyBboxPatch((5.2, 7.3), 3.9, 2.1, boxstyle="round,pad=0.1", ec="#0d9488", fc="#f0fdfa", lw=1.5)
    ax.add_patch(m2)
    ax.text(7.15, 9.0, "Module 2: Big Data & ML", fontsize=8.5, fontweight='bold', ha='center', color='#115e59')
    ax.text(7.15, 8.2, "• S3 Data Lake & Apache Spark\n• PySpark Windowed ETL\n• AWS Glue Catalog & Athena\n• Amazon Redshift Star Schema", fontsize=7.2, ha='center', va='center', color='#134e4a')

    # Mod 3
    m3 = patches.FancyBboxPatch((0.9, 5.3), 3.9, 1.8, boxstyle="round,pad=0.1", ec="#a855f7", fc="#faf5ff", lw=1.5)
    ax.add_patch(m3)
    ax.text(2.85, 6.7, "Module 3: Generative AI & RAG", fontsize=8.5, fontweight='bold', ha='center', color='#6b21a8')
    ax.text(2.85, 6.0, "• RAG Vector Knowledge Base\n• 32-dim Cosine Embeddings\n• Prompt Engineering Studio\n• Autonomous ReAct AI Agent", fontsize=7.2, ha='center', va='center', color='#581c87')

    # Mod 4
    m4 = patches.FancyBboxPatch((5.2, 5.3), 3.9, 1.8, boxstyle="round,pad=0.1", ec="#f43f5e", fc="#fff1f2", lw=1.5)
    ax.add_patch(m4)
    ax.text(7.15, 6.7, "Module 4: Security & Governance", fontsize=8.5, fontweight='bold', ha='center', color='#9f1239')
    ax.text(7.15, 6.0, "• AWS KMS Envelope Encryption\n• IAM Least-Privilege Policies\n• Multi-AZ Amazon VPC Topology\n• CloudTrail & Threat Detection", fontsize=7.2, ha='center', va='center', color='#881337')

    ax.annotate("", xy=(5, 4.1), xytext=(5, 5.0),
                arrowprops=dict(arrowstyle="<|-|>", color="#059669", lw=2.5, shrinkA=5, shrinkB=5))
    ax.text(5.2, 4.5, "boto3 AWS SDK & VPC Endpoints", fontsize=8, color="#047857", fontweight='bold')

    # Layer 3: Persistence Layer
    rect_data = patches.FancyBboxPatch((0.5, 0.8), 9, 3.2, boxstyle="round,pad=0.2", ec="#10b981", fc="#f0fdf4", lw=2)
    ax.add_patch(rect_data)
    ax.text(5, 3.7, "DATA, CLOUD PERSISTENCE & ANALYTICS WAREHOUSE LAYER", fontsize=11, fontweight='bold', ha='center', color='#15803d')

    d1 = patches.FancyBboxPatch((1.0, 1.2), 2.5, 2.2, boxstyle="round,pad=0.1", ec="#059669", fc="#ffffff", lw=1.5)
    ax.add_patch(d1)
    ax.text(2.25, 2.9, "Amazon DynamoDB", fontsize=9, fontweight='bold', ha='center', color='#047857')
    ax.text(2.25, 2.0, "Single-Table Core DB\n'sharekind-core-dev'\nPK/SK Partitioning\nGSI1 & Entity Index\n22 Seeded Records", fontsize=7.5, ha='center', va='center', color='#1e293b')

    d2 = patches.FancyBboxPatch((3.75, 1.2), 2.5, 2.2, boxstyle="round,pad=0.1", ec="#0284c7", fc="#ffffff", lw=1.5)
    ax.add_patch(d2)
    ax.text(5.0, 2.9, "Amazon S3 Lake", fontsize=9, fontweight='bold', ha='center', color='#0369a1')
    ax.text(5.0, 2.0, "Partitioned Lake\n'sharekind-analytics-lake'\nSnappy Parquet Curated\nDonations Archive\nGlue Catalog Ready", fontsize=7.5, ha='center', va='center', color='#1e293b')

    d3 = patches.FancyBboxPatch((6.5, 1.2), 2.5, 2.2, boxstyle="round,pad=0.1", ec="#7c3aed", fc="#ffffff", lw=1.5)
    ax.add_patch(d3)
    ax.text(7.75, 2.9, "Redshift & CloudWatch", fontsize=9, fontweight='bold', ha='center', color='#6d28d9')
    ax.text(7.75, 2.0, "Amazon Redshift DWH\nStar Schema (Fact/Dims)\nAWS CloudTrail Events\n/aws/sharekind/dev\nGuardDuty Alerts", fontsize=7.5, ha='center', va='center', color='#1e293b')

    plt.tight_layout()
    plt.savefig("report/system_architecture.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved report/system_architecture.png")


def create_activity_diagram_platform():
    fig, ax = plt.subplots(figsize=(6, 8.5), dpi=300)
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(3, 10.1, "Figure 4.1.1: Module 1 Platform Engineering Activity Diagram", fontsize=9.5, fontweight='bold', ha='center')

    steps = [
        "START",
        "Trigger CI/CD Pipeline (GitHub Actions)",
        "Run Flake8 & Bandit SAST Security Audit",
        "Execute Pytest Suite & Build Vite Bundle",
        "Deploy Lambda Microservices (sharekind-core-dev)",
        "Configure Amazon API Gateway Routes",
        "Invoke AWS Step Functions (OrderFulfillmentWorkflow)",
        "Validate Inventory & Authorize Escrow Funds",
        "Coordinate Logistics & Dispatch Milestones",
        "Update CloudWatch Observability Metrics",
        "END"
    ]

    y = 9.3
    for i, s in enumerate(steps):
        is_terminal = (i == 0 or i == len(steps)-1)
        bg = "#e2e8f0" if is_terminal else "#eff6ff"
        bc = "#475569" if is_terminal else "#2563eb"
        p = patches.FancyBboxPatch((0.8, y-0.25), 4.4, 0.48, boxstyle="round,pad=0.1", ec=bc, fc=bg, lw=1.5)
        ax.add_patch(p)
        ax.text(3, y, s, fontsize=7.2, fontweight='bold' if is_terminal else 'normal', ha='center', va='center', color='#0f172a')
        
        if i < len(steps)-1:
            ax.annotate("", xy=(3, y-0.45), xytext=(3, y-0.25),
                        arrowprops=dict(arrowstyle="->", color="#2563eb", lw=1.5))
        y -= 0.82

    plt.tight_layout()
    plt.savefig("report/activity_diagram_platform.png", dpi=300, bbox_inches='tight')
    plt.savefig("report/activity_diagram_cloud.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved report/activity_diagram_platform.png")


def create_activity_diagram_bigdata():
    fig, ax = plt.subplots(figsize=(6, 8.5), dpi=300)
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(3, 10.1, "Figure 4.2.1: Module 2 Big Data & ML Activity Diagram", fontsize=9.5, fontweight='bold', ha='center')

    steps = [
        "START",
        "Stream Transactions to S3 Raw Data Lake",
        "Initialize Apache Spark (PySpark) SparkSession",
        "Enforce Schema & Cast Types on S3 Raw JSON",
        "Mask Donor Names & PII with SHA-256 Hashes",
        "Compute PySpark Window Functions (Running Totals)",
        "Write Snappy Parquet Partitions (Year/Month)",
        "Register Metadata in AWS Glue Data Catalog",
        "Execute Amazon Redshift COPY Command",
        "Run OLAP Analytics Queries & ML Demand Forecast",
        "END"
    ]

    y = 9.3
    for i, s in enumerate(steps):
        is_terminal = (i == 0 or i == len(steps)-1)
        bg = "#e2e8f0" if is_terminal else "#f0fdfa"
        bc = "#475569" if is_terminal else "#0d9488"
        p = patches.FancyBboxPatch((0.8, y-0.25), 4.4, 0.48, boxstyle="round,pad=0.1", ec=bc, fc=bg, lw=1.5)
        ax.add_patch(p)
        ax.text(3, y, s, fontsize=7.2, fontweight='bold' if is_terminal else 'normal', ha='center', va='center', color='#0f172a')
        
        if i < len(steps)-1:
            ax.annotate("", xy=(3, y-0.45), xytext=(3, y-0.25),
                        arrowprops=dict(arrowstyle="->", color="#0d9488", lw=1.5))
        y -= 0.82

    plt.tight_layout()
    plt.savefig("report/activity_diagram_bigdata.png", dpi=300, bbox_inches='tight')
    plt.savefig("report/activity_diagram_data.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved report/activity_diagram_bigdata.png")


def create_activity_diagram_genai():
    fig, ax = plt.subplots(figsize=(6, 8.5), dpi=300)
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(3, 10.1, "Figure 4.3.1: Module 3 Generative AI & RAG Activity Diagram", fontsize=9.5, fontweight='bold', ha='center')

    steps = [
        "START",
        "Ingest NGO Operational Charters & Guidelines",
        "Generate 32-dim Normalized Dense Vector Embeddings",
        "User Submits Natural Language Query",
        "Compute Cosine Similarity Across Document Chunks",
        "Extract Top-k Grounded Document Snippets",
        "Construct Augmented System Prompt with Context",
        "Invoke Foundation Model (Claude 3.5 / Bedrock)",
        "Synthesize Grounded Answer with Inline Citations",
        "Execute Autonomous ReAct AI Agent Tool Loop",
        "END"
    ]

    y = 9.3
    for i, s in enumerate(steps):
        is_terminal = (i == 0 or i == len(steps)-1)
        bg = "#e2e8f0" if is_terminal else "#faf5ff"
        bc = "#475569" if is_terminal else "#9333ea"
        p = patches.FancyBboxPatch((0.8, y-0.25), 4.4, 0.48, boxstyle="round,pad=0.1", ec=bc, fc=bg, lw=1.5)
        ax.add_patch(p)
        ax.text(3, y, s, fontsize=7.2, fontweight='bold' if is_terminal else 'normal', ha='center', va='center', color='#0f172a')
        
        if i < len(steps)-1:
            ax.annotate("", xy=(3, y-0.45), xytext=(3, y-0.25),
                        arrowprops=dict(arrowstyle="->", color="#9333ea", lw=1.5))
        y -= 0.82

    plt.tight_layout()
    plt.savefig("report/activity_diagram_genai.png", dpi=300, bbox_inches='tight')
    plt.savefig("report/activity_diagram_ai.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved report/activity_diagram_genai.png")


def create_activity_diagram_security():
    fig, ax = plt.subplots(figsize=(6, 8.5), dpi=300)
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 10.5)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(3, 10.1, "Figure 4.4.1: Module 4 Security & Governance Activity Diagram", fontsize=9.5, fontweight='bold', ha='center')

    steps = [
        "START",
        "Authenticate User & Issue Scoped JWT Token",
        "Evaluate Least-Privilege IAM Policy Statement",
        "Enforce Strict Role Isolation (403 on Escalation)",
        "Generate 256-bit Plaintext Data Key (PDK)",
        "Envelope Encrypt Sensitive PII (AES-256-GCM)",
        "Encrypt PDK Under AWS KMS Master Key (CMK)",
        "Route Traffic Through Multi-AZ Amazon VPC Subnets",
        "Record Immutable Audit Event in AWS CloudTrail",
        "Scan for Anomalies via Amazon GuardDuty Engine",
        "END"
    ]

    y = 9.3
    for i, s in enumerate(steps):
        is_terminal = (i == 0 or i == len(steps)-1)
        bg = "#e2e8f0" if is_terminal else "#fff1f2"
        bc = "#475569" if is_terminal else "#e11d48"
        p = patches.FancyBboxPatch((0.8, y-0.25), 4.4, 0.48, boxstyle="round,pad=0.1", ec=bc, fc=bg, lw=1.5)
        ax.add_patch(p)
        ax.text(3, y, s, fontsize=7.2, fontweight='bold' if is_terminal else 'normal', ha='center', va='center', color='#0f172a')
        
        if i < len(steps)-1:
            ax.annotate("", xy=(3, y-0.45), xytext=(3, y-0.25),
                        arrowprops=dict(arrowstyle="->", color="#e11d48", lw=1.5))
        y -= 0.82

    plt.tight_layout()
    plt.savefig("report/activity_diagram_security.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved report/activity_diagram_security.png")


if __name__ == "__main__":
    create_system_architecture()
    create_activity_diagram_platform()
    create_activity_diagram_bigdata()
    create_activity_diagram_genai()
    create_activity_diagram_security()
    print("All diagrams generated successfully for all 4 Wipro CPPE modules!")
