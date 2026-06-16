# SkillBridge — AI-Powered Career Platform

> **Bridge Your Skills to Limitless Opportunities**

A production-ready, full-stack AI-powered job board and career networking platform built with Next.js 15, TypeScript, PostgreSQL, Prisma, NextAuth, and OpenAI.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Running Locally](#running-locally)
8. [Testing](#testing)
9. [Production Build](#production-build)
10. [Deployment Guide](#deployment-guide)
    - [Vercel](#deploy-to-vercel)
    - [Railway](#deploy-to-railway)
    - [Render](#deploy-to-render)
    - [VPS Ubuntu](#deploy-to-vps-ubuntu)
11. [Custom Domain & HTTPS](#custom-domain--https)
12. [Service Integrations](#service-integrations)
13. [GitHub Setup](#github-setup)
14. [Troubleshooting](#troubleshooting)
15. [Launch Checklist](#launch-checklist)

---

## ✨ Features

### For Job Seekers
- AI-powered job matching with compatibility scores
- Skill portfolio with endorsements
- Resume upload & ATS scoring via OpenAI
- Skill gap detection with course recommendations
- Application tracking (Pending → Interview → Hired)
- AI Career Advisor chatbot
- Real-time notifications

### For Employers
- Post and manage job listings
- AI candidate ranking and matching
- Applicant Tracking System (ATS)
- Interview scheduling
- Company profile management

### For Admins
- Full user management (activate/suspend/delete)
- Platform analytics dashboard
- Reports with charts (Users, Jobs, Applications)
- Job moderation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| UI Components | Radix UI + Shadcn |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth v5 + JWT |
| AI | OpenAI GPT-4o-mini |
| File Storage | Cloudinary |
| State | React Query + Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

---

## 📁 Project Structure

```
skillbridge/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # NextAuth + Register
│   │   ├── jobs/               # Jobs CRUD
│   │   ├── applications/       # Application management
│   │   ├── ai/                 # OpenAI integrations
│   │   ├── analytics/          # Dashboard stats
│   │   ├── users/              # User management
│   │   ├── profile/            # Profile API
│   │   ├── messages/           # Messaging
│   │   ├── notifications/      # Notifications
│   │   └── upload/             # Cloudinary upload
│   ├── auth/                   # Login / Register pages
│   ├── dashboard/              # Role-based dashboards
│   │   ├── job-seeker/
│   │   ├── employer/
│   │   └── admin/
│   ├── jobs/                   # Job listings + detail
│   ├── applications/           # Application tracker
│   ├── profile/                # User profile
│   ├── recommendations/        # AI recommendations
│   ├── post-job/               # Employer job posting
│   ├── applicants/             # Employer ATS
│   ├── manage-users/           # Admin user management
│   ├── reports/                # Admin analytics
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── landing/                # Landing page sections
│   ├── layout/                 # Navbar, Sidebar, TopBar, Footer
│   ├── dashboard/              # Dashboard widgets
│   ├── charts/                 # Recharts components
│   └── Providers.tsx
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma client
│   ├── openai.ts               # OpenAI utilities
│   └── utils.ts                # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
├── types/
│   └── index.ts                # TypeScript types
├── middleware.ts               # Route protection
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn
- Git

### Step 1 — Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge

# Install dependencies
npm install
```

### Step 2 — Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

### Step 3 — Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

### Step 4 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillbridge.com | Admin@123 |
| Employer | hr@techsolutions.com | Employer@123 |
| Job Seeker | john@example.com | Seeker@123 |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillbridge"

# ── NextAuth ──────────────────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# ── Google OAuth ──────────────────────────────────────────────────────────────
# https://console.cloud.google.com → Credentials → OAuth 2.0 Client ID
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ── GitHub OAuth ──────────────────────────────────────────────────────────────
# https://github.com/settings/developers → New OAuth App
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# ── OpenAI ────────────────────────────────────────────────────────────────────
# https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# ── Cloudinary ────────────────────────────────────────────────────────────────
# https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ── Email (optional) ─────────────────────────────────────────────────────────
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@skillbridge.com"

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SkillBridge"
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🗄 Database Setup

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu)
sudo apt update && sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE skillbridge;
CREATE USER skilluser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE skillbridge TO skilluser;
\q

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://skilluser:password@localhost:5432/skillbridge"
```

### Option B: Docker PostgreSQL

```bash
docker run -d \
  --name skillbridge_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=skillbridge \
  -p 5432:5432 \
  postgres:16-alpine
```

### Option C: Full Docker Compose

```bash
docker-compose up -d postgres
```

### Run Migrations

```bash
# Development (creates migration files)
npx prisma migrate dev --name init

# Production (applies existing migrations)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Seed Database

```bash
npx prisma db seed
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🖥 Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

---

## 🧪 Testing

```bash
# Test the API endpoints
curl http://localhost:3000/api/jobs
curl http://localhost:3000/api/analytics

# Test authentication
# 1. Open http://localhost:3000/auth/login
# 2. Enter: john@example.com / Seeker@123
# 3. Should redirect to /dashboard/job-seeker

# Test employer flow
# 1. Login: hr@techsolutions.com / Employer@123
# 2. Should see employer dashboard

# Test admin flow
# 1. Login: admin@skillbridge.com / Admin@123
# 2. Should see admin dashboard
```

---

## 🏗 Production Build

```bash
# Build the app
npm run build

# Start production server
npm start

# Or with PM2
npm install -g pm2
pm2 start npm --name skillbridge -- start
pm2 save
pm2 startup
```

---

## 🌐 Deployment Guide

### Deploy to Vercel (Recommended)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/skillbridge.git
git push -u origin main
```

**Step 2: Import in Vercel**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

**Step 3: Add Environment Variables**

In Vercel dashboard → Project Settings → Environment Variables, add all variables from your `.env` file.

**Step 4: Add Database**
- Vercel Postgres: Dashboard → Storage → Create Database
- Or use external: Neon, Supabase, PlanetScale

**Step 5: Deploy**
```bash
# Via CLI
npm install -g vercel
vercel --prod
```

**Step 6: Run Migrations on Production**
```bash
DATABASE_URL="your-prod-db-url" npx prisma migrate deploy
DATABASE_URL="your-prod-db-url" npx prisma db seed
```

---

### Deploy to Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Click **Deploy from GitHub repo**
3. Add a **PostgreSQL** service
4. Set environment variables in Variables tab
5. Railway auto-detects Next.js and deploys

```bash
# Add Railway CLI
npm install -g @railway/cli
railway login
railway link
railway up
```

---

### Deploy to Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repository
3. Build Command: `npm install && npx prisma generate && npm run build`
4. Start Command: `npm start`
5. Add a **PostgreSQL** database service
6. Set all environment variables

---

### Deploy to VPS Ubuntu

**Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

**Step 2: Database Setup**
```bash
sudo -u postgres psql
CREATE DATABASE skillbridge;
CREATE USER skilluser WITH PASSWORD 'StrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE skillbridge TO skilluser;
\q
```

**Step 3: Clone & Configure**
```bash
cd /var/www
sudo git clone https://github.com/yourusername/skillbridge.git
cd skillbridge
sudo npm install
sudo cp .env.example .env
sudo nano .env  # Edit with production values
```

**Step 4: Build & Migrate**
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

**Step 5: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/skillbridge
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/skillbridge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Step 6: Start with PM2**
```bash
pm2 start npm --name skillbridge -- start
pm2 save
pm2 startup
```

---

## 🔒 Custom Domain & HTTPS

### Add Domain to Vercel
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS: Add CNAME record pointing to `cname.vercel-dns.com`

### Enable HTTPS on VPS (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow prompts — SSL cert auto-installed
# Auto-renew:
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔗 Service Integrations

### Cloudinary (File Upload)
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Settings → API Keys
3. Copy Cloud Name, API Key, API Secret to `.env`

### OpenAI API
1. Create account at [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Add to `.env` as `OPENAI_API_KEY`
4. Ensure billing is set up (uses GPT-4o-mini)

### Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create Project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. For production: `https://yourdomain.com/api/auth/callback/google`

### GitHub OAuth
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

---

## 📤 Upload to GitHub

```bash
# Initialize repository
git init

# Stage all files
git add .

# Initial commit
git commit -m "🚀 Initial commit — SkillBridge v1.0"

# Create GitHub repo at github.com/new, then:
git remote add origin https://github.com/yourusername/skillbridge.git
git branch -M main
git push -u origin main
```

---

## 🐛 Troubleshooting

### "prisma: command not found"
```bash
npx prisma generate
# or
npm install  # reinstall packages
```

### "Cannot find module '@/lib/prisma'"
```bash
# Make sure tsconfig.json has paths configured:
# "@/*": ["./*"]
npm run type-check
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d skillbridge -c "SELECT 1;"

# Verify DATABASE_URL format:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### NextAuth errors
```bash
# Ensure NEXTAUTH_SECRET is set
openssl rand -base64 32

# Ensure NEXTAUTH_URL matches your domain exactly
# Development: http://localhost:3000
# Production: https://yourdomain.com
```

### Build fails: "Type errors"
```bash
npm run type-check
# Fix TypeScript errors before building
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Prisma migration error
```bash
# Reset and re-migrate (DEV ONLY — deletes data)
npx prisma migrate reset

# Force migration
npx prisma db push
```

### Cloudinary upload fails
```bash
# Verify credentials in .env
# Check file size < 10MB
# Ensure CLOUDINARY_CLOUD_NAME is correct (not URL)
```

---

## ✅ Launch Checklist

### Pre-launch
- [ ] All environment variables configured in production
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Database seeded (optional for production)
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NEXTAUTH_SECRET` is a strong random value
- [ ] OAuth callback URLs updated to production domain
- [ ] OpenAI API key has billing enabled
- [ ] Cloudinary credentials verified
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] SSL certificate installed

### Security Checklist
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in source code
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Strong database password
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Rate limiting on API routes (optional: add rate-limiter-flexible)

### Performance Checklist
- [ ] Next.js Image Optimization enabled
- [ ] Database queries use appropriate indexes
- [ ] React Query caching configured
- [ ] Production build tested: `npm run build && npm start`

### Post-launch
- [ ] Test all user flows (register → apply → hire)
- [ ] Verify AI features work (resume analysis, job matching)
- [ ] Test OAuth login (Google, GitHub)
- [ ] Test file uploads (resume, avatar)
- [ ] Check admin dashboard analytics
- [ ] Set up monitoring (Vercel Analytics, Sentry)
- [ ] Configure database backups

---

## 📞 Support

- **GitHub Issues**: Open an issue for bugs
- **Docs**: [docs.skillbridge.com](https://docs.skillbridge.com)
- **Email**: support@skillbridge.com

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

Made with ❤️ by the SkillBridge Team
