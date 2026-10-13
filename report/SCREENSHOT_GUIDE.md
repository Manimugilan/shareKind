# ShareKind — Evaluator Screenshot Guide for Word Report (.docx)

This guide provides exact, step-by-step instructions on where to capture and where to paste screenshots for all **4 Wipro CPPE modules** in your report document:
👉 **File Location:** `report/ShareKind_Project_Report.docx`

---

## 📸 Section 4.1: Module 1 — Cloud Product & Platform Engineering

### Screenshot 4.1.1: AWS Step Functions Visual Execution Graph
* **Where to capture:**
  1. Open the ShareKind Web Application in your browser (`http://localhost:5173/` or S3 Website URL).
  2. In the top navbar or sidebar, click **Mod 1: Platform** &rarr; select **AWS Step Functions Orchestration**.
  3. Enter Quantity `100` and Budget `$400`, then click **Launch Step Function Execution**.
  4. Capture the screen showing the 8-state transition graph with green completed nodes and execution output.
* **Where to paste:** In `report/ShareKind_Project_Report.docx` under box `[PASTE SCREENSHOT HERE: 4.1.1]`.

### Screenshot 4.1.2: Microservices Topology & Live Health Metrics
* **Where to capture:**
  1. Under **Mod 1: Platform**, click the **Microservices & API Gateway Topology** tab.
  2. Capture the screen showing API Gateway p95 latency (38.4ms) and the table of 5 deployed AWS Lambda functions (`sharekind-core-dev`, `OrderInventoryValidation`, etc.).
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.1.2]`.

### Screenshot 4.1.3: GitHub Actions Automated CI/CD Pipeline Dashboard
* **Where to capture:**
  1. Under **Mod 1: Platform**, click the **Automated CI/CD Deployment Pipeline** tab.
  2. Click **Trigger CI/CD Pipeline**.
  3. Capture the screen showing the 4 stages (Lint & SAST, Unit Tests, Build & Package, Deploy AWS Cloud) with green checkmarks.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.1.3]`.

---

## 📸 Section 4.2: Module 2 — Data Engineering, Big Data & ML Insights

### Screenshot 4.2.1: PySpark ETL Execution Pipeline & Stages
* **Where to capture:**
  1. In the ShareKind web app, navigate to **Mod 2: Big Data** &rarr; select **Apache Spark / PySpark ETL Pipeline**.
  2. Click **Launch PySpark Lake Curator**.
  3. Capture the screen showing the 6 stages completed, 1,560 records ingested, and Parquet partitions written.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.2.1]`.

### Screenshot 4.2.2: Amazon Redshift Star Schema & OLAP Query Results
* **Where to capture:**
  1. Under **Mod 2: Big Data**, click **Amazon Redshift Star Schema & OLAP**.
  2. Click **Query 1: Supplier SLA & Cost**.
  3. Capture the screen showing the tabular OLAP results, columnar engine badge, and query latency (145ms).
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.2.2]`.

### Screenshot 4.2.3: Machine Learning Demand Forecast & Deficit Alerts
* **Where to capture:**
  1. Under **Mod 2: Big Data**, click **Machine Learning Demand & Deficit Insights**.
  2. Capture the screen showing Model R² goodness-of-fit (0.912) and the community deficit alerts banner.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.2.3]`.

---

## 📸 Section 4.3: Module 3 — Generative AI, Foundation Models & RAG

### Screenshot 4.3.1: RAG Semantic Knowledge Query & Citations
* **Where to capture:**
  1. In the ShareKind web app, navigate to **Mod 3: GenAI & RAG** &rarr; select **RAG & Vector Knowledge Retrieval**.
  2. Click **Retrieve & Answer** for the question: *"What are Hope Haven meal guidelines?"*.
  3. Capture the screen showing the grounded response and the cited document chunk boxes with similarity scores (94.0%).
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.3.1]`.

### Screenshot 4.3.2: Prompt Engineering Studio Playground
* **Where to capture:**
  1. Under **Mod 3: GenAI & RAG**, click **Prompt Engineering Studio**.
  2. Adjust the Temperature slider and click **Generate Completion**.
  3. Capture the screen showing System Instructions, Rendered User Prompt, and Model Generated Completion.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.3.2]`.

### Screenshot 4.3.3: Autonomous AI Agent ReAct Reasoning Trace
* **Where to capture:**
  1. Under **Mod 3: GenAI & RAG**, click **Autonomous AI Agent (ReAct Loop)**.
  2. Click **Run Autonomous Agent**.
  3. Capture the screen showing the 4 ReAct Thought/Action/Observation steps and the final synthesized $335 procurement plan.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.3.3]`.

---

## 📸 Section 4.4: Module 4 — Cloud Security, Cryptography & Governance

### Screenshot 4.4.1: AWS KMS Envelope Encryption & Decryption
* **Where to capture:**
  1. In the ShareKind web app, navigate to **Mod 4: Security & KMS** &rarr; select **AWS KMS Envelope Encryption**.
  2. Click **Encrypt with KMS CMK (AES-256-GCM)**, then click **Decrypt with AWS KMS**.
  3. Capture the screen showing the Ciphertext Base64, EDK Hex, and decrypted text with cryptographic verification badge.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.4.1]`.

### Screenshot 4.4.2: AWS IAM Least-Privilege Policy Evaluator
* **Where to capture:**
  1. Under **Mod 4: Security & KMS**, click **AWS IAM Least-Privilege Policies**.
  2. Select role **DONOR** and action **sharekind:VerifyPartner**.
  3. Capture the screen showing the immediate **DENY (EXPLICIT)** red boundary alert enforcing donor isolation.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.4.2]`.

### Screenshot 4.4.3: Amazon VPC Multi-AZ Network Topology
* **Where to capture:**
  1. Under **Mod 4: Security & KMS**, click **Amazon VPC Multi-AZ Topology**.
  2. Capture the screen showing the 6 subnets across Public DMZ, Private Compute, and Isolated Data tiers.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.4.3]`.

### Screenshot 4.4.4: AWS CloudTrail Ledger & GuardDuty Threat Findings
* **Where to capture:**
  1. Under **Mod 4: Security & KMS**, click **CloudTrail & Threat Detection**.
  2. Capture the screen showing the GuardDuty threat alert cards and the immutable CloudTrail event ledger table.
* **Where to paste:** Under box `[PASTE SCREENSHOT HERE: 4.4.4]`.
