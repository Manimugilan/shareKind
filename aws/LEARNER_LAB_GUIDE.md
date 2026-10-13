# ShareKind — Complete AWS Learner Lab Deployment Guide

This guide explains how to deploy **ShareKind** to **AWS Academy Learner Lab** and utilize **all the major AWS cloud server and database services**:
- **Amazon EC2:** Dedicated Linux compute server running the FastAPI REST gateway & AI scoring engine.
- **AWS Lambda:** Serverless microservices.
- **Amazon S3 (Web Server):** Static website hosting for the Vite React frontend.
- **Amazon S3 (Data Lake):** Data Lake storage for CSV and JSON analytics exports.
- **Amazon DynamoDB:** Pay-Per-Request NoSQL single-table database (`sharekind-core-dev`).
- **Amazon API Gateway:** REST API management and routing.
- **Amazon CloudWatch:** Server log groups, metric monitors, and audit trails.
- **AWS Glue & Amazon Athena:** Serverless Data Catalog and Presto SQL query engine.

---

## 1. Important AWS Learner Lab Rules & Constraints

In AWS Academy Learner Lab:
1. **You cannot create custom IAM Roles** (`iam:CreateRole` will be rejected).
2. All Lambda functions and cloud resources **MUST** use the pre-created role:  
   `arn:aws:iam::<YOUR_ACCOUNT_ID>:role/LabRole`
3. All EC2 instances **MUST** use the pre-created instance profile:  
   `LabInstanceProfile`
4. Cognito and CloudFront may have restricted capabilities depending on your institution's lab policy. To guarantee 100% evaluation success, **S3 Static Web Hosting** is used for the frontend and **EC2 / Lambda + DynamoDB** for the backend.

---

## 2. Step 1: Copy Your Learner Lab Credentials

1. Open your **AWS Academy Learner Lab** console.
2. Click the green **Start Lab** button and wait until the status indicator turns **AWS (Green)**.
3. Click the **AWS Details** button (near the top-right next to *Readme*).
4. Next to **AWS CLI**, click **Show**.
5. Copy the 3 lines containing your temporary credentials:
   ```bash
   aws_access_key_id=ASIA...
   aws_secret_access_key=...
   aws_session_token=IQoJ...
   ```

---

## 3. Method A: The 1-Command Automated Python Deployer (Recommended)

We have provided a pre-tested deployment script [`aws/deploy_learner_lab.py`](file:///c:/Users/joths/Desktop/projects/wipro%20cppe/aws/deploy_learner_lab.py).

### Run the Deployer
In your terminal, run:
```bash
python aws/deploy_learner_lab.py
```

### What It Does Automatically:
1. Prompts for your 3 Learner Lab credentials (or reads them from your environment).
2. Authenticates with your AWS Learner Lab account via STS.
3. Provisions the Amazon DynamoDB table `sharekind-core-dev`.
4. Populates DynamoDB with verified synthetic records (15 donations, 4 NGOs, 10 suppliers, 8 needs, 5 orders).
5. Creates the Amazon S3 static web server bucket `sharekind-frontend-<account_id>-dev`.
6. Uploads all production HTML, JS, and CSS assets from `frontend/dist/`.
7. Configures public website access and prints your live public URL:  
   `http://sharekind-frontend-<account_id>-dev.s3-website-us-east-1.amazonaws.com`
8. Creates the S3 Analytics Data Lake bucket `sharekind-analytics-<account_id>-dev`.
9. Creates the Amazon CloudWatch Log Group `/aws/sharekind/dev`.

---

## 4. Method B: Deploy via AWS CloudFormation Console

If you prefer deploying via the AWS Web Console:

1. In the AWS Management Console search bar, search for **CloudFormation**.
2. Click **Create stack** &rarr; **With new resources (standard)**.
3. Select **Upload a template file** &rarr; Choose file:  
   [`aws/learner_lab_template.yaml`](file:///c:/Users/joths/Desktop/projects/wipro%20cppe/aws/learner_lab_template.yaml).
4. Click **Next**.
5. Set:
   - **Stack name:** `sharekind-platform`
   - **VpcId:** Select your default VPC from the dropdown.
   - **SubnetId:** Select any public subnet from the dropdown.
6. Click **Next** &rarr; **Next** &rarr; Check **I acknowledge that AWS CloudFormation might create IAM resources** &rarr; **Submit**.
7. Wait ~2 minutes for `CREATE_COMPLETE`.
8. Click the **Outputs** tab to view your:
   - **FrontendWebsiteUrl** (Public website link)
   - **BackendEc2PublicIp** (Your dedicated cloud server IP)
   - **BackendApiUrl** (`http://<ip>:8000`)
   - **DynamoDBTableName**

---

## 5. Method C: Launching a Dedicated EC2 Backend Server Manually

To launch a dedicated Linux cloud server in the AWS Console:

1. Search for **EC2** in the AWS Console &rarr; Click **Launch Instance**.
2. **Name:** `ShareKind-Backend-Server`
3. **Application and OS Images:** Amazon Linux 2023 (or Ubuntu 22.04 LTS).
4. **Instance type:** `t2.micro` or `t3.micro` (Free tier / Learner Lab eligible).
5. **Key pair:** Proceed without a key pair (or select an existing one).
6. **Network settings:**
   - Allow SSH traffic (Port 22)
   - Allow HTTP traffic (Port 80)
   - Add Custom TCP Rule: **Port 8000**, Source: `0.0.0.0/0` (Anywhere)
7. **Advanced details:**
   - **IAM instance profile:** Select `LabInstanceProfile`.
   - Scroll down to **User data** &rarr; Paste the contents of [`aws/ec2_user_data.sh`](file:///c:/Users/joths/Desktop/projects/wipro%20cppe/aws/ec2_user_data.sh).
8. Click **Launch instance**.
9. Once running, copy your instance's **Public IPv4 address**. Your API will be live at:  
   `http://<EC2_PUBLIC_IP>:8000/health`

---

## 6. Method D: Running Analytics on AWS Glue & Amazon Athena

To show serverless big-data SQL queries to your evaluator:

1. Open **Amazon Athena** in the AWS Console.
2. In the query editor, select **sharekind_analytics_db** (or create it using `CREATE DATABASE sharekind_analytics_db;`).
3. Paste the queries from [`aws/glue_athena/athena_queries.sql`](file:///c:/Users/joths/Desktop/projects/wipro%20cppe/aws/glue_athena/athena_queries.sql):
   ```sql
   SELECT 
       category,
       COUNT(donation_id) AS total_donations_count,
       ROUND(SUM(amount), 2) AS total_funds_collected,
       ROUND(AVG(amount), 2) AS average_donation_size
   FROM sharekind_analytics_db.donations
   GROUP BY category
   ORDER BY total_funds_collected DESC;
   ```
4. Click **Run**. Athena queries the JSON/CSV data stored on Amazon S3 without any database server!

---

## 7. Connecting Your Frontend to Your AWS EC2 / Lambda Backend

Once your backend is running on EC2 or Lambda:
1. Open the ShareKind frontend.
2. Click **Profile & Cloud Setup** in the sidebar (or navigate to `/profile`).
3. Under **REST API Gateway Endpoint**, replace `http://localhost:8000` with your AWS EC2 URL:  
   `http://<YOUR_EC2_PUBLIC_IP>:8000`
4. Click **Test Connection**. A green badge will confirm:  
   *`Connected to live FastAPI / AWS server at http://<YOUR_EC2_PUBLIC_IP>:8000`*.

---

## 8. College Evaluator Presentation Script

When demonstrating to your evaluator:

1. **Show the AWS Cloud Architecture:**
   Explain: *"We deployed a multi-tier hybrid architecture inside AWS Academy Learner Lab using Amazon EC2 for the backend REST API, AWS Lambda for serverless microservices, Amazon DynamoDB for our single-table NoSQL store, Amazon S3 for public website hosting and analytics data lakes, and Amazon CloudWatch for immutable audit logging."*
2. **Show the Live S3 Public URL:**
   Open the S3 website URL in your browser and demonstrate that it is hosted on AWS.
3. **Show the AWS Console:**
   - Show the **EC2 console** with the running instance.
   - Show the **DynamoDB console** with the `sharekind-core-dev` table and items.
   - Show the **S3 console** with the frontend bucket and analytics lake.
   - Show the **CloudWatch console** with log events.
4. **Demonstrate the Workflows:**
   - Donor donation &rarr; NGO need &rarr; AI supplier ranking &rarr; Order state machine &rarr; Verified distribution.
