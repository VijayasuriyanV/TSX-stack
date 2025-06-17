# 🚀 TSX-stack

**TSX-stack** is a powerful interactive CLI tool that scaffolds modern **React + TypeScript + Vite** projects with fully configurable options for routing, styling, state management, query handling, and optional dev tools — all using TypeScript and best practices out-of-the-box.

## 📚 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration Options](#-configuration-options)
- [Generated Structure](#-generated-structure)
- [Examples](#-examples)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)
- [License](#-license)

---

## 📖 Introduction

**TSX-stack** eliminates boilerplate by guiding you through a series of prompts to generate a fully working React + Vite + TypeScript app. It supports major ecosystem libraries and frameworks, making it a perfect tool for both prototyping and production-ready applications.

---

## ✨ Features

- ✅ Interactive CLI
- ⚡ Uses **Vite** for fast builds
- 🎨 Styling options: Tailwind CSS, Material UI, or none
- 🌐 Router options: TanStack Router or React Router
- 🔌 Plug-and-play with state managers: Redux Toolkit, Zustand, or Jotai
- 🔍 Query management via TanStack Query
- 🧪 DevTools support for Tanstack routers and Tanstack queries
- 🔔 Optional integration of React Toastify
- 🧩 Automatically generates Navbar, Footer, Home, and About pages, along with router setup based on user-selected styling

---

## ⚙️ Installation

```bash
npm install -g TSX-stack
```

Or use directly with `npx`:

```bash
npx TSX-stack
```

---

## 🖥️ Usage

Launch the interactive CLI:

```bash
npx TSX-stack
```

Follow the prompts to:

- Name your project
- Choose styling framework
- Select routing library
- Add state/query libraries
- Enable optional devtools/toast notifications

Once generated:

```bash
cd your-project-name
npm install
npm run dev
```

---

## 🧩 Configuration Options

During setup, you’ll be prompted for:

| Option             | Choices                                   |
| ------------------ | ----------------------------------------- |
| `Project name`     | Any valid folder name                     |
| `Styling`          | Tailwind CSS, Material UI, None           |
| `Router`           | TanStack Router, React Router, None       |
| `Router Devtools`  | Yes / No (if TanStack Router is selected) |
| `State Management` | Redux Toolkit, Zustand, Jotai, None       |
| `Query Library`    | TanStack Query, React Query, None         |
| `Query Devtools`   | Yes / No (if query lib is selected)       |
| `Toastify`         | Yes / No                                  |

---

## 🗂️ Generated Structure

```
your-app/
├── public/
├── src/
│   ├── common/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── Pages/
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── routes/ (if routing is enabled)
│   │   └── router.tsx or Layout.tsx
│   ├── store/ (if Redux is selected)
│   │   └── store.ts
│   ├── App.tsx
│   └── index.tsx
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 🧪 Examples

### Example 1: Tailwind + TanStack Router + Zustand

```bash
npx TSX-stack
```

_Choose Tailwind, TanStack Router, Zustand, and enable devtools when prompted._

### Example 2: MUI + React Router + Redux Toolkit + Toastify

```bash
npx TSX-stack
```

_Select Material UI, React Router, Redux, and Toastify during prompts._

---

## 📦 Dependencies

Depending on selected options, these libraries may be installed:

- **Core:** `react`, `react-dom`, `typescript`, `vite`, `@vitejs/plugin-react`
- **Styling:** `tailwindcss`, `@tailwindcss/vite`, `@mui/material`, `@emotion/react`
- **Routing:** `@tanstack/react-router`, `@tanstack/router-devtools`, `react-router-dom`
- **State Management:** `@reduxjs/toolkit`, `react-redux`, `zustand`, `jotai`
- **Query:** `@tanstack/react-query`, `@tanstack/react-query-devtools`
- **UI Enhancements:** `react-toastify`

---

## 🛠️ Troubleshooting

| Issue                            | Solution                                                       |
| -------------------------------- | -------------------------------------------------------------- |
| Folder already exists            | Choose a different project name or remove the existing folder. |
| Module not found during setup    | Check your internet connection and rerun the generator.        |
| Permission errors during install | Try running with elevated permissions or fix directory access. |

---

## 👨‍💻 Contributors

- **Vijaya Suriyan V** — Creator & Maintainer

> PRs welcome! Help improve `TSX-stack` by submitting ideas, fixes, or enhancements.

---

## 📄 License

MIT © Vijaya Suriyan V
Feel free to use, modify, and distribute as needed.

---
