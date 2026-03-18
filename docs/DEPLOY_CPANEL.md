# Deploy Next.js to cPanel

This project is configured for **static export** (`output: 'export'`). Each build produces an **`out`** folder with static HTML/CSS/JS that you can upload to any web host.

## Static export (current setup)

1. **Build and export**
   ```bash
   npm run build
   ```
   This creates the **`out`** folder in your project root.

2. **Upload**
   Upload the **entire contents** of the `out` folder to your cPanel **public_html** (or a subdomain folder) via File Manager or FTP. Do not upload the `out` folder itself—upload the files and folders **inside** `out` so that `index.html` is at the document root.

3. **Base path (if in a subfolder)**
   If the site is not at the domain root (e.g. `yourdomain.com/440_pools/`), set `basePath` in `next.config.ts` to that path and rebuild before uploading.

---

## Option: Node.js on cPanel

If your host has **“Setup Node.js App”**, you can instead run the app with Node (no static export): remove `output: "export"` from `next.config.ts`, then follow the steps below.

---

## Option A: cPanel with Node.js support (recommended)

### 1. Prepare the project

- In your repo, add to `.gitignore` (if not already):  
  `node_modules`, `.next`, `.env.local`
- Do **not** commit `node_modules` or `.next`; they will be created on the server.

### 2. Upload the project

- Upload your project (e.g. via **File Manager**, **Git**, or **SSH**) into a folder like `~/440_pools` or `~/public_html/440_pools` (depending on how you want the app to live).
- The folder should contain: `package.json`, `next.config.ts`, `app/`, `components/`, etc. No `node_modules`, no `.next`.

### 3. Create the Node.js app in cPanel

1. In cPanel, open **“Setup Node.js App”** or **“Node.js Selector”**.
2. Click **“Create Application”**.
3. Set:
   - **Node.js version**: 18.x or 20.x (must be ≥ 18.18).
   - **Application root**: folder where you uploaded the project (e.g. `440_pools`).
   - **Application URL**: subdomain or domain (e.g. `app.yourdomain.com` or `yourdomain.com`).
   - **Application startup file**: leave default or set to run the start script (see below).
4. Save/Create.

### 4. Install and build on the server

In the same Node.js app screen, use **“Run NPM Install”** (or run these in **Terminal** from the application root):

```bash
cd ~/440_pools   # or your application root path
npm install
npm run build
```

### 5. Start command

Set the start command for the app to:

```bash
npm start
```

Or, if the panel asks for a “script” or “start file”, use:

```bash
node_modules/.bin/next start
```

cPanel usually sets `PORT`; Next.js uses it automatically.

### 6. Start / restart the app

- In “Setup Node.js App”, use **“Start”** or **“Restart”** so the app keeps running and is proxied to your domain.

### 7. Environment variables

- If you use `.env` / `.env.local`, add the same variables in the Node.js app’s **“Environment Variables”** section in cPanel (or create `.env` on the server and upload it outside of git).

---

## Option B: cPanel without Node.js (static only)

If your cPanel has **no** Node.js support and only serves static files:

1. You would need to switch the app to **static export** (`output: 'export'` in `next.config`).
2. That only works for static pages; dynamic routes like `/products/[productId]` and server-side features would not work the same.
3. For a full Next.js app with dynamic routes and APIs, Option A (Node.js on cPanel or another host) is required.

---

## Checklist

- [ ] Node.js 18+ selected in cPanel
- [ ] Project uploaded (no `node_modules`, no `.next`)
- [ ] `npm install` and `npm run build` run in application root
- [ ] Start command set to `npm start` (or `node_modules/.bin/next start`)
- [ ] App started/restarted in cPanel
- [ ] Env vars set if the app needs them
