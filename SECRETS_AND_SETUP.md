# 🔐 TRISHUL PRO — GitHub Secrets & Pipeline Setup Guide
**Author: Aruna | Project: Trishul Pro Master**

---

## 📋 WHAT YOU NEED TO DO (One-Time Setup)

### STEP 1 — Get Your EC2 SSH Private Key

Your key file is called `arun.pem`. You need its contents.

1. Open your `arun.pem` file in any text editor (Notepad, VS Code, etc.)
2. Copy the **entire content** — it looks like:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA3qKlm...
...long block of characters...
-----END RSA PRIVATE KEY-----
```
3. Keep this copied. You'll paste it as a GitHub Secret.

---

### STEP 2 — Add These 3 Secrets to GitHub

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these **3 secrets** exactly:

| Secret Name      | Value to Paste                        |
|-----------------|---------------------------------------|
| `EC2_HOST`      | `13.206.70.60`                        |
| `EC2_USERNAME`  | `ubuntu`                              |
| `EC2_SSH_KEY`   | *(paste the full contents of arun.pem)* |

> ⚠️ **CRITICAL**: For `EC2_SSH_KEY`, paste the ENTIRE file content including the
> `-----BEGIN...-----` and `-----END...-----` lines.

---

### STEP 3 — One-Time Server Bootstrap (Last Time You'll Touch Terminal)

This is the **only** time you ever SSH into your server. After this, never again.

```bash
# Connect to your EC2
ssh -i arun.pem ubuntu@13.206.70.60

# Download and run the bootstrap script
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/bootstrap-ec2.sh
chmod +x bootstrap-ec2.sh
./bootstrap-ec2.sh
```

> After this runs, your server is live and GitHub Actions takes over forever.

---

### STEP 4 — Open Port 80 in AWS Security Group

Your EC2 security group (`launch-wizard-1`) needs port 80 open:

1. Go to **AWS Console** → **EC2** → **Security Groups**
2. Find `launch-wizard-1`
3. Click **Edit Inbound Rules**
4. Add rule:
   - Type: **HTTP**
   - Port: **80**
   - Source: **0.0.0.0/0** (anywhere)
5. Save

---

## 🔄 HOW THE AUTO-PILOT WORKS

```
You push code to GitHub
         │
         ▼
GitHub Actions triggers automatically
         │
         ▼
SSH into EC2 (13.206.70.60)
         │
         ▼
git pull (latest code)
         │
         ▼
docker compose up --build (rebuild containers)
         │
         ▼
Health check confirms app is running
         │
         ▼
✅ Live at http://13.206.70.60
```

---

## 🛡️ SELF-HEALING EXPLAINED

Your app will **automatically restart** in these scenarios:

| Scenario                          | What Happens                        |
|----------------------------------|-------------------------------------|
| App crashes / throws error       | Docker restarts it instantly        |
| EC2 server reboots               | Docker starts on boot, app comes up |
| Memory overload / OOM kill       | Docker restarts the container       |
| New code pushed to GitHub        | GitHub Actions deploys it           |

The magic line in `docker-compose.yml`:
```yaml
restart: always
```
This single setting handles ALL crash/reboot scenarios.

---

## 📁 FILE STRUCTURE IN YOUR REPO

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions pipeline
├── Dockerfile                  ← Container definition
├── docker-compose.yml          ← Service orchestration + self-healing
├── nginx.conf                  ← Web server config
├── bootstrap-ec2.sh            ← One-time server setup script
├── trishul-pratham.html        ← Page 1
├── trishul-dwitiya.html        ← Page 2
├── trishul-tritiya.html        ← Page 3
├── trishul-chaturth.html       ← Page 4
├── trishul-command.html        ← Page 5 (Command Center)
├── trinetra/                   ← Trinetra project
└── garud/                      ← Garud project
```

---

## 🌐 YOUR APP URLS (After Deployment)

| Project           | URL                                      |
|------------------|------------------------------------------|
| Trishul Home      | http://13.206.70.60                      |
| Pratham (Page 1)  | http://13.206.70.60/pratham             |
| Dwitiya (Page 2)  | http://13.206.70.60/dwitiya             |
| Tritiya (Page 3)  | http://13.206.70.60/tritiya             |
| Chaturth (Page 4) | http://13.206.70.60/chaturth            |
| Command Center    | http://13.206.70.60/command             |
| Trinetra          | http://13.206.70.60/trinetra            |
| Garud             | http://13.206.70.60/garud               |

---

## 🚨 TROUBLESHOOTING

**Q: GitHub Actions is failing — "Permission denied"**
→ Your `EC2_SSH_KEY` secret is wrong. Re-paste the full `arun.pem` content including header/footer lines.

**Q: I can't reach http://13.206.70.60**
→ Port 80 is not open. Follow Step 4 above (AWS Security Group).

**Q: Docker command not found on server**
→ Re-run `bootstrap-ec2.sh`. Then log out and log back in (Docker group needs refresh).

**Q: Changes pushed but old version showing**
→ Hard refresh your browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac).

---

*After the one-time bootstrap, you will never need to open a terminal again.
Every `git push` = automatic deploy. That's the deal.* ✅
