# Handworks Admin

Admin dashboard for Handworks Cleaning Services — a Next.js + TypeScript project used to manage admin workflows for the Handworks app.

**Features**

- Admin user management and authentication
- Dashboard UI components built with Tailwind CSS + component library
- Clerk integration for auth (login, signup, email verification)

**Requirements**

- Node.js 18+ (or the version specified in your environment)
- npm or yarn

**Quick Start (development)**

1. Install dependencies

```bash
npm install
```

2. Create a local environment file (create `.env.local` or ask from any of the other devs) and add required variables (auth keys, API endpoints, etc.).

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Build for production**

```bash
npm run build
npm run start
```

**Common commands**

- `npm run dev` — Run Next.js in development mode
- `npm run build` — Create an optimized production build
- `npm run start` — Start the production server after building
- `npm run lint` — Run linters (if configured)

**Environment variables**

- Add any secrets or API keys to `.env.local` (do NOT commit secrets to git). Typical variables for this project may include Clerk keys and any backend API URLs.

**Folder structure (high-level)**

- `src/app` — Next.js App Router pages and layouts
- `src/components` — Reusable UI and auth components
- `src/context` — React context providers (admin context, etc.)
- `src/lib` — Utility functions
- `public` — Static assets (favicons, images)

**Contributing**

- Open an issue for feature requests or bugs
- Branch from `main` and open a PR with a clear description and testing steps
