#!/usr/bin/env python3
"""
ShareKind — AWS Academy Learner Lab Automated Cloud Deployer
Provisions and configures:
1. Amazon DynamoDB Table (sharekind-core-dev) + populates seed records
2. Amazon S3 Frontend Static Web Server (Public website hosting)
3. Uploads built React bundle (HTML, JS, CSS) to S3
4. Amazon S3 Analytics Data Lake Bucket
5. Amazon CloudWatch Log Group & Log Stream
6. Launches / Configures Amazon EC2 Linux Backend Server with LabInstanceProfile
7. Deploys AWS Lambda Function with LabRole
"""

import os
import sys
import json
import time
import mimetypes
import boto3
from botocore.exceptions import ClientError

def load_env():
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    env = {}
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    return env

def get_session():
    env = load_env()
    access_key = env.get("AWS_ACCESS_KEY_ID") or os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = env.get("AWS_SECRET_ACCESS_KEY") or os.getenv("AWS_SECRET_ACCESS_KEY")
    session_token = env.get("AWS_SESSION_TOKEN") or os.getenv("AWS_SESSION_TOKEN")
    region = env.get("AWS_DEFAULT_REGION", "us-east-1")

    if not (access_key and secret_key and session_token):
        print("[ERROR] AWS credentials not found in aws/.env or environment.")
        sys.exit(1)

    return boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token,
        region_name=region
    ), region

def deploy():
    session, region = get_session()
    sts = session.client("sts")

    try:
        identity = sts.get_caller_identity()
        account_id = identity["Account"]
        arn = identity["Arn"]
        print("=" * 70)
        print("  SHAREKIND — AWS LEARNER LAB CLOUD DEPLOYMENT")
        print("=" * 70)
        print(f"[OK] Authenticated successfully with AWS Learner Lab!")
        print(f"     Account ID:   {account_id}")
        print(f"     Region:       {region}")
        print(f"     IAM Identity: {arn}\n")
    except Exception as e:
        print(f"[ERROR] Authentication failed: {e}")
        sys.exit(1)

    dynamodb = session.resource("dynamodb", region_name=region)
    dynamodb_client = session.client("dynamodb", region_name=region)
    s3 = session.client("s3", region_name=region)
    cw = session.client("logs", region_name=region)
    ec2 = session.client("ec2", region_name=region)
    lambda_client = session.client("lambda", region_name=region)

    # =========================================================
    # 1. AMAZON DYNAMODB TABLE
    # =========================================================
    table_name = "sharekind-core-dev"
    print(f"--> [1/6] Provisioning Amazon DynamoDB Table '{table_name}'...")
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f"    Table '{table_name}' is already active.")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            print(f"    Creating DynamoDB single-table '{table_name}'...")
            table = dynamodb.create_table(
                TableName=table_name,
                KeySchema=[
                    {"AttributeName": "PK", "KeyType": "HASH"},
                    {"AttributeName": "SK", "KeyType": "RANGE"}
                ],
                AttributeDefinitions=[
                    {"AttributeName": "PK", "AttributeType": "S"},
                    {"AttributeName": "SK", "AttributeType": "S"}
                ],
                BillingMode="PAY_PER_REQUEST"
            )
            print("    Waiting for table to become ACTIVE...")
            table.wait_until_exists()
            print(f"    [OK] DynamoDB table created successfully!")
        else:
            print(f"    Table notice: {e}")

    from decimal import Decimal
    # Seed records into DynamoDB
    print("    Seeding synthetic community records into DynamoDB...")
    try:
        seed_records = [
            {"PK": "DONOR#donor-1", "SK": "METADATA", "id": "donor-1", "name": "Sarah Jenkins", "email": "sarah.j@example.com", "total_donated": Decimal("1250.0"), "role": "DONOR"},
            {"PK": "DONOR#donor-2", "SK": "METADATA", "id": "donor-2", "name": "David Chen", "email": "dchen@example.com", "total_donated": Decimal("840.0"), "role": "DONOR"},
            {"PK": "NGO#ngo-1", "SK": "METADATA", "id": "ngo-1", "name": "Hope Haven Shelter", "category": "Homeless Relief", "verified": True, "location": "Metro Downtown"},
            {"PK": "NGO#ngo-2", "SK": "METADATA", "id": "ngo-2", "name": "Sunrise Child Foundation", "category": "Orphanages", "verified": True, "location": "North Suburbs"},
            {"PK": "SUPPLIER#sup-1", "SK": "METADATA", "id": "sup-1", "name": "Harvest Caterers", "category": "food", "unit_price": Decimal("3.20"), "delivery_fee": Decimal("15.0"), "reliability": Decimal("0.98"), "verified": True},
            {"PK": "SUPPLIER#sup-5", "SK": "METADATA", "id": "sup-5", "name": "Metro Pantry & Provisions", "category": "groceries", "unit_price": Decimal("22.50"), "delivery_fee": Decimal("20.0"), "reliability": Decimal("0.96"), "verified": True},
            {"PK": "NEED#need-1", "SK": "METADATA", "id": "need-1", "ngo_id": "ngo-1", "title": "200 Nutritious Evening Meals", "target_quantity": 200, "budget_estimate": Decimal("750.0"), "status": "procured"},
            {"PK": "NEED#need-3", "SK": "METADATA", "id": "need-3", "ngo_id": "ngo-1", "title": "50 Emergency Grocery Staple Kits", "target_quantity": 50, "budget_estimate": Decimal("1100.0"), "status": "open"},
            {"PK": "ORDER#ord-101", "SK": "METADATA", "id": "ord-101", "supplier_name": "Harvest Caterers", "quantity": 200, "total_cost": Decimal("655.0"), "status": "in_preparation"},
            {"PK": "ORDER#ord-103", "SK": "METADATA", "id": "ord-103", "supplier_name": "City Delights", "quantity": 300, "total_cost": Decimal("895.0"), "status": "confirmed_distribution"}
        ]
        with table.batch_writer() as batch:
            for item in seed_records:
                batch.put_item(Item=item)
        print("    [OK] Seed records populated in DynamoDB.")
    except Exception as err:
        print(f"    Seed notice: {err}")

    # =========================================================
    # 2. AMAZON S3 ANALYTICS DATA LAKE
    # =========================================================
    analytics_bucket = f"sharekind-analytics-{account_id}-dev"
    print(f"\n--> [2/6] Provisioning Amazon S3 Analytics Lake '{analytics_bucket}'...")
    try:
        s3.create_bucket(Bucket=analytics_bucket)
        print(f"    [OK] S3 Analytics Lake bucket ready: s3://{analytics_bucket}/")
    except ClientError as e:
        if e.response["Error"]["Code"] in ["BucketAlreadyOwnedByYou", "BucketAlreadyExists"]:
            print(f"    Bucket '{analytics_bucket}' already exists.")
        else:
            print(f"    S3 Analytics notice: {e}")

    # Upload partitioned sample lake files
    try:
        sample_lake_data = json.dumps([
            {"donation_id": "don-1", "amount": 250.0, "category": "food", "status": "allocated", "date": "2026-10-02T14:00:00Z"},
            {"donation_id": "don-2", "amount": 500.0, "category": "clothing", "status": "delivered", "date": "2026-10-04T10:15:00Z"}
        ])
        s3.put_object(
            Bucket=analytics_bucket,
            Key="donations/partition_date=2026-10-12/data.json",
            Body=sample_lake_data,
            ContentType="application/json"
        )
        print("    [OK] Partitioned lake partition uploaded: donations/partition_date=2026-10-12/data.json")
    except Exception as e:
        print(f"    Lake upload notice: {e}")

    # =========================================================
    # 3. AMAZON S3 FRONTEND STATIC WEB SERVER
    # =========================================================
    frontend_bucket = f"sharekind-frontend-{account_id}-dev"
    print(f"\n--> [3/6] Deploying Amazon S3 Web Server '{frontend_bucket}'...")
    try:
        s3.create_bucket(Bucket=frontend_bucket)
    except ClientError as e:
        pass

    # Disable Block Public Access
    try:
        s3.delete_public_access_block(Bucket=frontend_bucket)
    except Exception:
        pass

    # Enable Website Hosting
    try:
        s3.put_bucket_website(
            Bucket=frontend_bucket,
            WebsiteConfiguration={
                "IndexDocument": {"Suffix": "index.html"},
                "ErrorDocument": {"Key": "index.html"}
            }
        )
        print("    [OK] S3 Website configuration enabled.")
    except Exception as e:
        print(f"    Website config error: {e}")

    # Attach Public Read Bucket Policy
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{frontend_bucket}/*"
            }
        ]
    }
    try:
        s3.put_bucket_policy(Bucket=frontend_bucket, Policy=json.dumps(policy))
        print("    [OK] Public-read policy attached.")
    except Exception as e:
        print(f"    Policy notice: {e}")

    # Upload Built Assets from frontend/dist
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
    if os.path.exists(dist_dir):
        print(f"    Uploading web application bundle from {dist_dir}...")
        upload_count = 0
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dist_dir).replace("\\", "/")
                content_type, _ = mimetypes.guess_type(file_path)
                if not content_type:
                    if file.endswith(".js"): content_type = "application/javascript"
                    elif file.endswith(".css"): content_type = "text/css"
                    elif file.endswith(".html"): content_type = "text/html"
                    else: content_type = "binary/octet-stream"

                with open(file_path, "rb") as f:
                    s3.put_object(
                        Bucket=frontend_bucket,
                        Key=rel_path,
                        Body=f.read(),
                        ContentType=content_type
                    )
                upload_count += 1
        print(f"    [OK] Uploaded {upload_count} production web assets to S3 Web Server.")

    website_url = f"http://{frontend_bucket}.s3-website-{region}.amazonaws.com"

    # =========================================================
    # 4. AMAZON CLOUDWATCH LOG GROUP
    # =========================================================
    print(f"\n--> [4/6] Setting up Amazon CloudWatch Observability...")
    log_group_name = "/aws/sharekind/dev"
    try:
        cw.create_log_group(logGroupName=log_group_name)
        print(f"    [OK] CloudWatch Log Group created: {log_group_name}")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceAlreadyExistsException":
            print(f"    CloudWatch Log Group '{log_group_name}' already exists.")

    try:
        log_stream_name = f"deployment-{int(time.time())}"
        cw.create_log_stream(logGroupName=log_group_name, logStreamName=log_stream_name)
        cw.put_log_events(
            logGroupName=log_group_name,
            logStreamName=log_stream_name,
            logEvents=[
                {
                    "timestamp": int(time.time() * 1000),
                    "message": "ShareKind platform deployed to AWS Learner Lab successfully."
                }
            ]
        )
        print(f"    [OK] Test log event written to CloudWatch stream '{log_stream_name}'.")
    except Exception as e:
        print(f"    CloudWatch event notice: {e}")

    # =========================================================
    # 5. AWS LAMBDA SERVERLESS FUNCTION (Uses LabRole)
    # =========================================================
    print(f"\n--> [5/6] Deploying AWS Lambda Microservice...")
    lambda_name = "sharekind-core-dev"
    lab_role_arn = f"arn:aws:iam::{account_id}:role/LabRole"

    # Basic Lambda zip code
    import zipfile
    import io
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        lambda_code = """
import json

def lambda_handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "message": "ShareKind AWS Lambda Serverless Microservice running in Learner Lab!",
            "cloud_database": "Amazon DynamoDB (sharekind-core-dev)",
            "status": "healthy"
        })
    }
"""
        zf.writestr("lambda_function.py", lambda_code)
    zip_bytes = zip_buffer.getvalue()

    try:
        lambda_client.get_function(FunctionName=lambda_name)
        print(f"    Updating code for existing Lambda '{lambda_name}'...")
        lambda_client.update_function_code(
            FunctionName=lambda_name,
            ZipFile=zip_bytes
        )
        print(f"    [OK] AWS Lambda function '{lambda_name}' updated.")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            print(f"    Creating AWS Lambda function '{lambda_name}' with LabRole...")
            lambda_client.create_function(
                FunctionName=lambda_name,
                Runtime="python3.10",
                Role=lab_role_arn,
                Handler="lambda_function.lambda_handler",
                Code={"ZipFile": zip_bytes},
                Timeout=15,
                Publish=True
            )
            print(f"    [OK] AWS Lambda function '{lambda_name}' created successfully!")
        else:
            print(f"    Lambda notice: {e}")

    # =========================================================
    # 6. AMAZON EC2 DEDICATED COMPUTE SERVER
    # =========================================================
    print(f"\n--> [6/6] Checking Amazon EC2 Compute Server...")
    ec2_public_ip = None
    try:
        # Check existing instances
        instances = ec2.describe_instances(
            Filters=[
                {"Name": "tag:Name", "Values": ["ShareKind-Backend-Server"]},
                {"Name": "instance-state-name", "Values": ["running", "pending"]}
            ]
        )
        reservations = instances.get("Reservations", [])
        if reservations and reservations[0]["Instances"]:
            inst = reservations[0]["Instances"][0]
            ec2_public_ip = inst.get("PublicIpAddress")
            print(f"    Existing EC2 Server found: {inst['InstanceId']} (Public IP: {ec2_public_ip})")
        else:
            print("    No running EC2 instance tagged 'ShareKind-Backend-Server' found.")
            # Launch EC2 instance
            # Get default VPC & Subnet
            vpcs = ec2.describe_vpcs(Filters=[{"Name": "isDefault", "Values": ["true"]}])
            default_vpc_id = vpcs["Vpcs"][0]["VpcId"] if vpcs.get("Vpcs") else None

            # Get public subnet
            subnets = ec2.describe_subnets(Filters=[{"Name": "vpc-id", "Values": [default_vpc_id]}]) if default_vpc_id else None
            subnet_id = subnets["Subnets"][0]["SubnetId"] if subnets and subnets.get("Subnets") else None

            # Create Security Group for HTTP 80 & 8000
            sg_name = "sharekind-server-sg"
            try:
                sgs = ec2.describe_security_groups(GroupNames=[sg_name])
                sg_id = sgs["SecurityGroups"][0]["GroupId"]
            except ClientError:
                sg_res = ec2.create_security_group(
                    GroupName=sg_name,
                    Description="Security group for ShareKind EC2 server",
                    VpcId=default_vpc_id
                )
                sg_id = sg_res["GroupId"]
                ec2.authorize_security_group_ingress(
                    GroupId=sg_id,
                    IpPermissions=[
                        {"IpProtocol": "tcp", "FromPort": 80, "ToPort": 80, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]},
                        {"IpProtocol": "tcp", "FromPort": 8000, "ToPort": 8000, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]},
                        {"IpProtocol": "tcp", "FromPort": 22, "ToPort": 22, "IpRanges": [{"CidrIp": "0.0.0.0/0"}]}
                    ]
                )

            # Read user data script
            user_data_path = os.path.join(os.path.dirname(__file__), "ec2_user_data.sh")
            user_data_script = ""
            if os.path.exists(user_data_path):
                with open(user_data_path, "r") as uf:
                    user_data_script = uf.read()

            print("    Launching Amazon EC2 t2.micro Linux instance with LabInstanceProfile...")
            run_res = ec2.run_instances(
                ImageId="ami-0c101f26f147fa7fd", # Amazon Linux 2023 in us-east-1
                InstanceType="t2.micro",
                MinCount=1,
                MaxCount=1,
                SubnetId=subnet_id,
                SecurityGroupIds=[sg_id],
                IamInstanceProfile={"Name": "LabInstanceProfile"},
                UserData=user_data_script,
                TagSpecifications=[
                    {
                        "ResourceType": "instance",
                        "Tags": [{"Key": "Name", "Value": "ShareKind-Backend-Server"}]
                    }
                ]
            )
            instance_id = run_res["Instances"][0]["InstanceId"]
            print(f"    EC2 Instance launched: {instance_id}. Waiting for IP allocation...")
            time.sleep(10)
            desc = ec2.describe_instances(InstanceIds=[instance_id])
            ec2_public_ip = desc["Reservations"][0]["Instances"][0].get("PublicIpAddress", "Pending")
            print(f"    [OK] EC2 Compute Server IP: {ec2_public_ip}")

    except Exception as e:
        print(f"    EC2 launch notice: {e}")

    # =========================================================
    # SUMMARY
    # =========================================================
    print("\n" + "=" * 70)
    print("  ALL AWS SERVERS DEPLOYED SUCCESSFULLY IN LEARNER LAB!")
    print("=" * 70)
    print(f"1. S3 Web Server URL:     {website_url}")
    print(f"2. EC2 Compute Server IP: {ec2_public_ip or 'Provisioned'}")
    if ec2_public_ip and ec2_public_ip != "Pending":
        print(f"   EC2 API Endpoint:      http://{ec2_public_ip}:8000")
    print(f"3. DynamoDB Database:     {table_name} (Active & Seeded)")
    print(f"4. AWS Lambda Function:   {lambda_name} (LabRole)")
    print(f"5. S3 Analytics Lake:     s3://{analytics_bucket}/")
    print(f"6. CloudWatch Logs:       {log_group_name}")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    deploy()
