# ShareKind — AWS Cloud Architecture & Infrastructure Guide

This directory contains the production-grade Infrastructure-as-Code (IaC) templates, Data Lake definitions, and serverless architectures designed for **ShareKind — Smart Donation & Community Support Platform**.

---

## 1. High-Level Architecture Overview

```
                                +---------------------------+
                                |    End Users (Browser)    |
                                +-------------+-------------+
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
                   v                                                     v
      +------------------------+                             +------------------------+
      |  Amazon CloudFront CDN |                             |   Amazon API Gateway   |
      +-----------+------------+                             |    (REST API Layer)    |
                  |                                          +-----------+------------+
                  v                                                      |
      +------------------------+                                         v
      |   Amazon S3 Bucket     |                              +-----------------------+
      | (Static Single Page App|                              |  Amazon Cognito Pools |
      +------------------------+                              |   (JWT Auth & RBAC)   |
                                                              +-----------------------+
                                                                         |
                                                                         v
                                                              +-----------------------+
                                                              |   AWS Lambda Server   |
                                                              | (Python Microservices)|
                                                              +-----------+-----------+
                                                                          |
                                      +-----------------------------------+-----------------------------------+
                                      |                                                                       |
                                      v                                                                       v
                          +------------------------+                                              +-----------------------+
                          |    Amazon DynamoDB     |                                              |   Amazon S3 Bucket    |
                          | (Single Table Core DB) |                                              | (Analytics Data Lake) |
                          +------------------------+                                              +-----------+-----------+
                                                                                                              |
                                                                                                              v
                                                                                                  +-----------------------+
                                                                                                  | AWS Glue Data Catalog |
                                                                                                  +-----------+-----------+
                                                                                                              |
                                                                                                              v
                                                                                                  +-----------------------+
                                                                                                  |     Amazon Athena     |
                                                                                                  |  (Serverless SQL BI)  |
                                                                                                  +-----------------------+
```

---

## 2. AWS Services Inventory

| Service | Purpose | Configuration / Details |
| :--- | :--- | :--- |
| **Amazon S3** | Static UI Hosting & Analytics Lake | Web bucket configured for static site hosting. Analytics bucket stores JSON/Parquet partitioned archives. |
| **Amazon CloudFront** | CDN & Global Caching | HTTPS SSL termination, edge caching for sub-second UI delivery. |
| **Amazon API Gateway** | API Management & Route Gateway | RESTful proxy routes with CORS enabled, request throttling (10,000 req/sec limit), API key management. |
| **AWS Lambda** | Serverless Backend Execution | Python 3.10 handlers with least-privilege IAM policies per microservice (Donations, Needs, Suppliers, Orders, Analytics). |
| **Amazon DynamoDB** | Operational NoSQL Database | Single-table design (`sharekind-core-dev`) with Global Secondary Indexes (`GSI1`, `EntityTypeIndex`) for single-digit ms lookups. |
| **Amazon Cognito** | Authentication & RBAC | User pools with custom role attributes (`DONOR`, `NGO`, `SUPPLIER`, `ADMIN`) and secure token issuance. |
| **AWS Glue** | Data Catalog & Metadata | Crawls analytics S3 bucket and maps raw schemas into queryable analytical tables without ETL servers. |
| **Amazon Athena** | Analytical Ad-hoc Queries | Presto-powered serverless SQL engine querying S3 data directly at pennies per query. |
| **Amazon CloudWatch** | Observability & Audit Log Alarms | Structured JSON log groups, invocation metrics, error rates, and alarm triggers. |

---

## 3. Deployment Instructions via AWS SAM CLI

### Prerequisites
- AWS CLI configured (`aws configure`)
- AWS SAM CLI installed (`sam --version`)
- Python 3.10+

### Steps to Deploy
```bash
# 1. Validate SAM template syntax
sam validate -t template.yaml

# 2. Build Serverless Functions
sam build -t template.yaml

# 3. Deploy to AWS Cloud
sam deploy --guided \
  --stack-name sharekind-platform-dev \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Stage=dev
```

---

## 4. Setting Up AWS Glue & Amazon Athena

1. **Deploy Analytics S3 Bucket:**
   Included in `template.yaml` as `ShareKindAnalyticsBucket`.

2. **Register Catalog Database:**
   ```bash
   aws glue create-database --database-input "{\"Name\":\"sharekind_analytics_db\"}"
   ```

3. **Register Tables with Schema:**
   Use the definitions in `aws/glue_athena/glue_schema.json` to create tables via the AWS Console or Glue API.

4. **Execute Analytical Queries:**
   Open the Amazon Athena Query Editor, select `sharekind_analytics_db`, and run the queries defined in `aws/glue_athena/athena_queries.sql`.
