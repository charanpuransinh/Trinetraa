#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  TRISHUL PRO — One-Time EC2 Bootstrap Script
#  Run this ONCE manually via SSH to set up the server.
#  After this, GitHub Actions handles everything automatically.
#  Author: Aruna | Server: 13.206.70.60 (AWS EC2)
# ─────────────────────────────────────────────────────────────

set -e  # Stop on any error

echo "╔══════════════════════════════════════════╗"
echo "║   TRISHUL PRO — EC2 BOOTSTRAP SETUP     ║"
echo "╚══════════════════════════════════════════╝"

# ── 1. Update system ──────────────────────────────────────────
echo ""
echo "▶ [1/6] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# ── 2. Install Docker ─────────────────────────────────────────
echo ""
echo "▶ [2/6] Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# ── 3. Allow ubuntu user to run Docker without sudo ──────────
echo ""
echo "▶ [3/6] Configuring Docker permissions..."
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

# ── 4. Install Git ────────────────────────────────────────────
echo ""
echo "▶ [4/6] Installing Git..."
sudo apt-get install -y git

# ── 5. Clone your GitHub repository ──────────────────────────
echo ""
echo "▶ [5/6] Cloning Trishul Pro repository..."
echo ""
echo "⚠️  REPLACE THE URL BELOW WITH YOUR ACTUAL GITHUB REPO URL"
echo "    Format: https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo ""

# Clone into /home/ubuntu/trishul-pro
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /home/ubuntu/trishul-pro

cd /home/ubuntu/trishul-pro

# ── 6. First deployment ───────────────────────────────────────
echo ""
echo "▶ [6/6] Starting containers for the first time..."
docker compose up -d --build

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✅ BOOTSTRAP COMPLETE!                  ║"
echo "║                                          ║"
echo "║  Your server is live at:                 ║"
echo "║  http://13.206.70.60                     ║"
echo "║                                          ║"
echo "║  From now on, just push to GitHub.       ║"
echo "║  Everything deploys automatically!       ║"
echo "╚══════════════════════════════════════════╝"

echo ""
echo "Running containers:"
docker compose ps
