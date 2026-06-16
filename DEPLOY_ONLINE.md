# Deploy SkillBridge Online (No Local Setup Needed)

This gets your app live on the internet using free services. Everything happens in your browser — no npm, no Docker, no terminal. About 15–20 minutes.

You'll use three free services:
- **GitHub** — stores your code online
- **Neon** — your cloud database (free)
- **Vercel** — builds and hosts the app (free)

---

## PART 1 — Put the code on GitHub

### 1.1 Create a GitHub account
Go to **https://github.com** and sign up (free). Verify your email.

### 1.2 Create a new repository
1. Click the **+** in the top-right → **New repository**
2. Repository name: `skillbridge`
3. Leave it **Public** (or Private — either works)
4. **Do NOT** check "Add a README" (your project already has files)
5. Click **Create repository**

### 1.3 Upload your project files
On the new empty repo page, click the link **"uploading an existing file"** (in the "…or push an existing repository" section, there's also a plain **"upload"** link near the top).

1. Open the **skillbridge** folder on your Desktop in File Explorer
2. **Select all the files and folders** inside it (Ctrl+A) — but **NOT** the `node_modules` folder if it's there (skip it; it's huge and not needed)
3. **Drag them** into the GitHub upload area in your browser
4. Wait for them to finish uploading (the folders like `app`, `components`, `prisma` will upload too)
5. Scroll down, click **Commit changes**

> If drag-and-drop is awkward with folders, that's normal in browsers. Tell your assistant and there's an alternative (GitHub Desktop app), but drag-drop usually works for the whole folder.

Your code is now on GitHub. ✅

---

## PART 2 — Create a free cloud database (Neon)

### 2.1 Sign up
Go to **https://neon.tech** → **Sign up** (use your GitHub account to make it quick — click "Continue with GitHub").

### 2.2 Create a project
1. Click **Create a project** (or it may prompt you automatically)
2. Name: `skillbridge`
3. Region: pick the one closest to you
4. Click **Create**

### 2.3 Copy the connection string
1. After it's created, you'll see a **Connection string** (it starts with `postgresql://...`)
2. Click the **copy** button next to it
3. **Paste it somewhere safe temporarily** (a Notepad window) — you need it in Part 3

It looks like:
```
postgresql://username:password@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Your database is ready. ✅

---

## PART 3 — Deploy on Vercel

### 3.1 Sign up
Go to **https://vercel.com** → **Sign up** → **Continue with GitHub** (this connects your code automatically).

### 3.2 Import your project
1. On the Vercel dashboard, click **Add New…** → **Project**
2. You'll see your GitHub repositories. Find **skillbridge** → click **Import**

### 3.3 Add environment variables (the important part)
Before clicking Deploy, expand the **Environment Variables** section and add these. For each one, type the **Name**, paste the **Value**, click **Add**:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | *paste your Neon connection string from Part 2* |
| `NEXTAUTH_SECRET` | *any long random text — e.g. mash your keyboard for 40+ characters* |
| `NEXTAUTH_URL` | `https://skillbridge.vercel.app` *(you'll fix this exact value in 3.5)* |
| `AUTH_SECRET` | *paste the SAME value you used for NEXTAUTH_SECRET* |
| `AUTH_TRUST_HOST` | `true` |

> The optional features (Google login, OpenAI, Cloudinary) can be added later the same way. The app runs without them.

### 3.4 Deploy
Click **Deploy**. Vercel will:
- install everything (handles the React 19 warnings automatically via the included `.npmrc`)
- create your database tables (via the build script)
- build the app

This takes 2–4 minutes. Watch the build log scroll.

### 3.5 Fix the URL and redeploy
1. When it finishes, Vercel gives you your real URL (like `https://skillbridge-abc123.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Edit **`NEXTAUTH_URL`** to your real URL exactly, click **Save**
4. Go to **Deployments** → click the **…** on the latest → **Redeploy**

### 3.6 Open your app
Click the URL. **Your SkillBridge app is live on the internet.** 🎉

---

## PART 4 — Add demo accounts (optional but recommended)

Your live database is empty at first (no users to log in with). To add the demo accounts:

The easiest way is through Neon's built-in SQL editor, but seeding is smoother with a quick local command if you ever get Node working. For now, you can **register a fresh account** directly on your live site at `/auth/register` — that works immediately and creates a real account in your cloud database.

If you want the full demo data (sample jobs, multiple roles), tell your assistant — there's a one-time way to run the seed against your Neon database.

---

## If the build fails on Vercel

Vercel shows a **build log**. If it goes red:
1. Click into the failed deployment → read the log
2. **Copy the error lines** (especially anything in red, or "Error:", "Module not found", "Type error")
3. Paste them to your assistant — cloud build errors are clear and fixable, usually quickly

Common ones:
- **"Type error" / TypeScript** — a code fix; paste it and get the patch
- **"Environment variable not found: DATABASE_URL"** — you missed adding it in 3.3
- **Database connection error** — your Neon string is wrong or missing `?sslmode=require`

---

## What you end up with

A live, public, hosted web app at a real URL you can share with anyone — running the full SkillBridge platform (all 15 screens), backed by a real cloud database. No software on your computer. To make changes later, you edit files on GitHub and Vercel auto-rebuilds.
