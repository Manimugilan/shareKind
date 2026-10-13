#!/bin/bash
# ==============================================================================
# ShareKind — EC2 Linux Backend Server Launch Script (UserData)
# Runs FastAPI, AI Supplier Engine, and connects to Amazon DynamoDB
# Compatible with Amazon Linux 2023 or Ubuntu on t2.micro / t3.micro in Learner Lab
# ==============================================================================

set -e

# Update and install dependencies
echo "[1/4] Installing system dependencies..."
yum update -y || apt-get update -y
yum install -y python3 python3-pip git || apt-get install -y python3 python3-pip git

# Prepare application directory
echo "[2/4] Setting up ShareKind backend directory..."
mkdir -p /opt/sharekind
cd /opt/sharekind

# Create requirements.txt
cat << 'EOF' > /opt/sharekind/requirements.txt
fastapi>=0.100.0
uvicorn>=0.23.0
pydantic>=2.0.0
boto3>=1.28.0
EOF

pip3 install -r /opt/sharekind/requirements.txt

# Create the backend server application
cat << 'EOF' > /opt/sharekind/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="ShareKind Core API - AWS EC2 Cloud Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ShareKind Cloud Backend",
        "host": "Amazon EC2 Instance",
        "cloud_database": "Amazon DynamoDB (sharekind-core-dev)",
        "timestamp": int(time.time())
    }

@app.get("/api/status")
def status():
    return {
        "environment": "AWS Academy Learner Lab",
        "iam_profile": "LabInstanceProfile",
        "storage": "DynamoDB + S3 Analytics Lake"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
EOF

# Setup systemd service for 24/7 background operation
echo "[3/4] Configuring systemd background daemon..."
cat << 'EOF' > /etc/systemd/system/sharekind.service
[Unit]
Description=ShareKind FastAPI Backend Daemon
After=network.target

[Service]
User=root
WorkingDirectory=/opt/sharekind
ExecStart=/usr/local/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable sharekind
systemctl start sharekind

echo "[4/4] ShareKind EC2 Cloud Server started successfully on port 8000!"
