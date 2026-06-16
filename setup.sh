#!/usr/bin/env bash
# SkillBridge — one-command local setup.
# Run from the project folder:  bash setup.sh
set -e

echo ""
echo "========================================"
echo "  SkillBridge — automated setup"
echo "========================================"
echo ""

# --- 1. Node check ---
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed. Install Node 20+ from https://nodejs.org then re-run."
  exit 1
fi
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node $(node -v) found. You need Node 18+ (20 recommended)."
  exit 1
fi
echo "[1/6] Node $(node -v) detected. OK."

# --- 2. .env ---
if [ ! -f .env ]; then
  cp .env.example .env
  # generate a real secret if openssl is available
  if command -v openssl >/dev/null 2>&1; then
    SECRET=$(openssl rand -base64 32)
    # replace the placeholder secret
    if grep -q "your-super-secret-key-change-in-production" .env; then
      sed -i.bak "s|your-super-secret-key-change-in-production|$SECRET|" .env && rm -f .env.bak
      echo "[2/6] Created .env and generated a NEXTAUTH_SECRET. OK."
    else
      echo "[2/6] Created .env. OK."
    fi
  else
    echo "[2/6] Created .env. NOTE: set NEXTAUTH_SECRET manually (any long random string)."
  fi
else
  echo "[2/6] .env already exists — leaving it as is."
fi

# --- 3. Database (Docker if available) ---
if command -v docker >/dev/null 2>&1; then
  echo "[3/6] Starting PostgreSQL via Docker..."
  docker compose up -d db
  echo "      Waiting for the database to be ready..."
  sleep 6
else
  echo "[3/6] Docker not found. Make sure PostgreSQL is running and DATABASE_URL in .env points to it."
fi

# --- 4. Install dependencies ---
echo "[4/6] Installing dependencies (this can take a few minutes)..."
npm install

# --- 5. Migrate + seed ---
echo "[5/6] Creating database tables and seeding demo data..."
npx prisma migrate dev --name init
npm run db:seed

# --- 6. Done ---
echo ""
echo "========================================"
echo "  Setup complete!"
echo "========================================"
echo ""
echo "  Start the app with:   npm run dev"
echo "  Then open:            http://localhost:3000"
echo ""
echo "  Demo logins:"
echo "    Admin     admin@skillbridge.com   / Admin@123"
echo "    Employer  hr@techsolutions.com    / Employer@123"
echo "  (seeker login is printed in the seed output above)"
echo ""
