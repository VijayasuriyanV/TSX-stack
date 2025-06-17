import fs from "fs-extra";
import path from "path";
import {execa} from "execa";
import {Ora} from "ora";

export interface ScaffoldConfig {
  appName: string;
  styling: "tailwind" | "mui" | "none";
  router: "tanstack-router" | "react-router" | "none";
  routerDevtools?: boolean;
  state: "redux" | "zustand" | "jotai" | "none";
  query: "tanstack-query" | "none";
  queryDevtools?: boolean;
  toastify?: boolean;
}

export async function scaffoldProject(config: ScaffoldConfig, spinner: Ora) {
  const {appName, styling, router, routerDevtools, state, query, queryDevtools, toastify} = config;

  const targetDir = path.join(process.cwd(), appName);
  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${appName}" already exists.`);
  }

  spinner.text = "Creating project directory...";
  await fs.mkdirp(targetDir);

  spinner.text = "Initializing Vite + React + TypeScript project...";
  await execa("npm", ["create", "vite@latest", appName, "--", "--template", "react-ts"], {
    stdio: "inherit",
  });

  const deps: string[] = [];
  const devDeps: string[] = [];

  if (styling === "tailwind") {
    devDeps.push("tailwindcss", "@tailwindcss/vite");
  } else if (styling === "mui") {
    deps.push("@mui/material", "@emotion/react", "@emotion/styled");
  }

  if (router === "tanstack-router") {
    deps.push("@tanstack/react-router");
    if (routerDevtools) deps.push("@tanstack/router-devtools");
  } else if (router === "react-router") {
    deps.push("react-router-dom");
  }

  if (state === "redux") {
    deps.push("@reduxjs/toolkit", "react-redux");
  } else if (state === "zustand") {
    deps.push("zustand");
  } else if (state === "jotai") {
    deps.push("jotai");
  }

  if (query === "tanstack-query") {
    deps.push("@tanstack/react-query");
    if (queryDevtools) deps.push("@tanstack/react-query-devtools");
  }

  if (toastify) {
    deps.push("react-toastify");
  }

  spinner.text = "Installing dependencies...";
  if (deps.length > 0) {
    await execa("npm", ["install", ...deps], {cwd: targetDir, stdio: "inherit"});
  }
  if (devDeps.length > 0) {
    await execa("npm", ["install", "-D", ...devDeps], {cwd: targetDir, stdio: "inherit"});
  }

  spinner.text = "Setting up Tailwind CSS if required...";
  if (styling === "tailwind") {
    await fs.outputFile(
      path.join(targetDir, "vite.config.ts"),
      `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`
    );
    await fs.outputFile(path.join(targetDir, "src", "index.css"), `@import "tailwindcss";`);
    await fs.outputFile(path.join(targetDir, "src", "app.css"), `@import "tailwindcss";`);
  }

  const commonDir = path.join(targetDir, "src", "common");
  await fs.mkdirp(commonDir);

  // Generate Navbar.tsx based on router + styling
  let navbarImport = "";
  let navbarContent = "";

  if (router === "tanstack-router") {
    navbarImport = `import { Link } from '@tanstack/react-router';`;
  } else if (router === "react-router") {
    navbarImport = `import { Link } from 'react-router-dom';`;
  }

  if (styling === "none") {
    await fs.outputFile(path.join(targetDir, "src", "index.css"), ``);
    await fs.outputFile(path.join(targetDir, "src", "app.css"), ``);
    navbarContent = `const Navbar = () => (
  <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
    <a href="/" style={{ marginRight: '1rem', color: 'white' }}>Home</a>
    <a href="/about" style={{ color: 'white' }}>About</a>
  </nav>
);

export default Navbar;`;
  } else if (styling === "mui") {
    navbarContent = `${navbarImport}
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/about">About</Button>
    </Toolbar>
  </AppBar>
);

export default Navbar;`;
  } else if (styling === "tailwind") {
    navbarContent = `${navbarImport}
const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex space-x-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About</Link>
    </div>
  </nav>
);

export default Navbar;`;
  } else {
    navbarContent = `${navbarImport}
const Navbar = () => (
  <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
    <Link to="/" style={{ marginRight: '1rem', color: 'white' }}>Home</Link>
    <Link to="/about" style={{ color: 'white' }}>About</Link>
  </nav>
);

export default Navbar;`;
  }

  await fs.writeFile(path.join(commonDir, "Navbar.tsx"), navbarContent);

  // Footer code stays the same (use your existing logic here)
  const footerContent =
    styling === "mui"
      ? `import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = () => (
  <Box component="footer" sx={{ p: 2, backgroundColor: '#eee', textAlign: 'center' }}>
    <Typography variant="body2" color="textSecondary">
      © ${new Date().getFullYear()} ${appName}
    </Typography>
  </Box>
);

export default Footer;`
      : styling === "tailwind"
      ? `const Footer = () => (
  <footer className="bg-gray-200 text-center p-4 mt-auto">
    <p className="text-gray-600">© ${new Date().getFullYear()} ${appName}</p>
  </footer>
);

export default Footer;`
      : `const Footer = () => (
  <footer style={{ padding: '1rem', backgroundColor: '#f2f2f2', textAlign: 'center' }}>
    <p>© ${new Date().getFullYear()} ${appName}</p>
  </footer>
);

export default Footer;`;

  await fs.writeFile(path.join(commonDir, "Footer.tsx"), footerContent);

  const pagesDir = path.join(targetDir, "src", "Pages");
  await fs.mkdirp(pagesDir);

  const homeContent =
    styling === "mui"
      ? `import Typography from '@mui/material/Typography';

const Home = () => <Typography variant="h4" sx={{ p: 2 }}>Welcome to the Home Page</Typography>;

export default Home;`
      : styling === "tailwind"
      ? `const Home = () => <div className="p-4 text-xl">Welcome to the Home Page</div>;

export default Home;`
      : `const Home = () => <div style={{ padding: '1rem', fontSize: '1.25rem' }}>Welcome to the Home Page</div>;

export default Home;`;

  const aboutContent =
    styling === "mui"
      ? `import Typography from '@mui/material/Typography';

const About = () => <Typography variant="h4" sx={{ p: 2 }}>This is the About Page</Typography>;

export default About;`
      : styling === "tailwind"
      ? `const About = () => <div className="p-4 text-xl">This is the About Page</div>;

export default About;`
      : `const About = () => <div style={{ padding: '1rem', fontSize: '1.25rem' }}>This is the About Page</div>;

export default About;`;

  await fs.writeFile(path.join(pagesDir, "Home.tsx"), homeContent);
  await fs.writeFile(path.join(pagesDir, "About.tsx"), aboutContent);

  if (router === "tanstack-router") {
    const routerDir = path.join(targetDir, "src", "routes");
    await fs.mkdirp(routerDir);

    await fs.writeFile(
      path.join(routerDir, "__root.tsx"),
      `import { Outlet } from "@tanstack/react-router";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const Layout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;`
    );

    await fs.writeFile(
      path.join(routerDir, "router.tsx"),
      `import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Layout from "./__root";
import Home from "../Pages/Home";
import About from "../Pages/About";

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, aboutRoute]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}`
    );
  }
  if (router === "react-router") {
    const routerDir = path.join(targetDir, "src", "routes");
    await fs.mkdirp(routerDir);

    await fs.writeFile(
      path.join(routerDir, "Layout.tsx"),
      `import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const Layout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
`
    );
  }

  if (state === "redux") {
    const storeDir = path.join(targetDir, "src", "store");
    await fs.mkdirp(storeDir);
    await fs.writeFile(
      path.join(storeDir, "store.ts"),
      `import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`
    );
  }

  spinner.text = "Generating App.tsx...";
  let appTsx = `import "./App.css";\n`;

  if (router === "tanstack-router") {
    appTsx += `import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/router";\n`;
  }

  if (router === "react-router") {
    appTsx += `import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";\n`;
  }

  if (toastify) {
    appTsx += `import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";\n`;
  }

  if (state === "redux") {
    appTsx += `import { Provider } from "react-redux";
import { store } from "./store/store";\n`;
  }

  if (query === "tanstack-query") {
    appTsx += `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();\n`;
  }

  if (router === "tanstack-router" && routerDevtools) {
    appTsx += `import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";\n`;
  }

  appTsx += `\nfunction App() {\n  return (\n`;

  if (state === "redux") appTsx += `    <Provider store={store}>\n`;
  if (query === "tanstack-query") appTsx += `      <QueryClientProvider client={queryClient}>\n`;

  if (router === "tanstack-router") {
    appTsx += `        <RouterProvider router={router} />\n`;
    if (routerDevtools) {
      appTsx += `        <TanStackRouterDevtools router={router} />\n`;
    }
  } else if (router === "react-router") {
    appTsx += `        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>\n`;
  }

  if (queryDevtools && query === "tanstack-query") {
    appTsx += `        <ReactQueryDevtools initialIsOpen={true} />\n`;
  }

  if (toastify) {
    appTsx += `        <ToastContainer
          position="top-right"
          autoClose={1000}
          closeOnClick
          draggable
          theme="colored"
          pauseOnHover
        />\n`;
  }

  if (query === "tanstack-query") appTsx += `      </QueryClientProvider>\n`;
  if (state === "redux") appTsx += `    </Provider>\n`;

  appTsx += `  );\n}\n\nexport default App;\n`;

  await fs.writeFile(path.join(targetDir, "src", "App.tsx"), appTsx);

  spinner.text = "Finalizing setup...";
  spinner.succeed("✔ Project scaffolded successfully");

  console.log(`\n👉 Get started:
  cd ${appName}
  npm run dev\n`);
}
