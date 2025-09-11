# Handworks Web Platform

![React](https://img.shields.io/badge/React-19%2B-61DAFB?logo=react&logoColor=white)
![NextJS](https://img.shields.io/badge/next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge\&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/Shadcn/UI-Components-000000?style=for-the-badge)
![Clerk](https://img.shields.io/badge/Auth-Clerk-orange?style=for-the-badge\&logo=clerk)

---

## Overview

**Handworks Web** is the client-facing platform for **Handworks Cleaning Services**, built with **Next.js (App Router)**, **TailwindCSS**, **shadcn/ui**, and **Clerk** for authentication.

This repository handles the **frontend** implementation, while all backend logic and APIs are managed through a dedicated [backend repository](https://github.com/Gnashal/handworks-microservice).

---

## Getting Started

### 1. Clone the Repository

#### HTTPS

```bash
git clone https://github.com/Gnashal/handworks-admin
```

#### SSH

```bash
git clone git@github.com:Gnashal/handworks-admin.git
```

---

### 2. Install Dependencies

```bash
npm install
```

> **Note:** Use **Node.js >= 18** and **npm >= 9** for best compatibility.

---

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Routing

This project uses the **Next.js App Router** with support for **multiple layouts**.

Example structure:

```
.
├── .idea/
│   └── workspace.xml
├── dist-electron/
│   ├── main.js
│   └── preload.mjs
├── electron/
│   ├── electron-env.d.ts
│   ├── main.ts
│   └── preload.ts
├── public/
│   ├── electron-vite.animate.svg
│   ├── electron-vite.svg
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.tsx
│   ├── global.css
│   ├── main.tsx
│   ├── routeTree.gen.ts
│   └── vite-env.d.ts
├── .eslintrc.cjs
├── .gitignore
├── electron-builder.json5
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

---

## Authentication

Authentication is managed by **Clerk**.

* Users can **Sign Up**, **Sign In**, and **Manage Sessions** via Clerk-provided components.
* Protected routes are wrapped with Clerk’s `authMiddleware` in **Next.js**.

---

## Styling

* **TailwindCSS** provides utility-first CSS styling.
* **shadcn/ui** is used for accessible, customizable components.
* Dark mode is supported out of the box.

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Run local dev server     |
| `npm run build` | Create production build  |
| `npm run start` | Run production server    |
| `npm run lint`  | Lint project with ESLint |

---


Developed and maintained by the **Handworks Development Team**.