# Handworks Admin

An **Electron application** built with **React, Vite, TypeScript, TailwindCSS**, and **Apollo Client**.  
Authentication is powered by [Clerk](https://clerk.com).

## 🚀 Tech Stack
- [Electron](https://www.electronjs.org/) – Desktop app framework  
- [Vite](https://vitejs.dev/) – Lightning-fast dev bundler  
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) – UI + type safety  
- [TailwindCSS](https://tailwindcss.com/) – Utility-first styling  
- [Apollo Client](https://www.apollographql.com/docs/react/) – GraphQL client  
- [Clerk](https://clerk.com/) – Authentication & user management  

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 📦 Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/Gnashal/handworks-admin.git
cd handworks-admin
```

### 2. Install dependencies
```bash
$ npm install
```

### 3. Environment variables
Create a `.env` file in the project root:
```env
# clerk auuth
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
# graphql api
VITE_API_GATEWAY=http://localhost:4000/graphql
```

### 4. Development

```bash
$ npm run dev
```
This starts:
- Electron main process
- Preload scripts
- React renderer (http://localhost:5173)

### 5. Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
