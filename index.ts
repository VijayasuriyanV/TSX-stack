#!/usr/bin/env node
import prompts from "prompts";
import chalk from "chalk";
import fs from "fs";
import minimist from "minimist";
import ora from "ora";
import {scaffoldProject, ScaffoldConfig} from "./scaffold.js";

const args = minimist(process.argv.slice(2));
const hasArgs = Object.keys(args).length > 1;

console.log(chalk.cyan("\n🚀 Welcome to TSX-stackz"));

let config: Partial<ScaffoldConfig> = {};

// Ctrl+C  to cancel
let isExiting = false;
process.on("SIGINT", async () => {
  if (isExiting) return;
  isExiting = true;

  const {exit} = await prompts({
    type: "confirm",
    name: "exit",
    message: "Are you sure you want to exit?",
    initial: true,
  });

  if (exit) {
    console.log(chalk.red("\n❌ Exiting..."));
    process.exit(0);
  } else {
    isExiting = false;
  }
});

(async () => {
  if (!hasArgs) {
    const responses = await prompts(
      [
        {
          type: "text",
          name: "appName",
          message: "Project name:",
          initial: "my-app",
          validate: (name) => (fs.existsSync(name) ? "Folder already exists." : true),
        },
        {
          type: "select",
          name: "styling",
          message: "Styling framework?",
          choices: [
            {title: "Tailwind CSS", value: "tailwind"},
            {title: "Material UI", value: "mui"},
            {title: "None", value: "none"},
          ],
        },
        {
          type: "select",
          name: "router",
          message: "Routing library?",
          choices: [
            {title: "TanStack Router", value: "tanstack-router"},
            {title: "React Router", value: "react-router"},
            {title: "None", value: "none"},
          ],
        },
        {
          type: "toggle",
          name: "routerDevtools",
          message: "Install TanStack Router Devtools?",
          initial: false,
        },

        {
          type: "select",
          name: "state",
          message: "State management?",
          choices: [
            {title: "Redux Toolkit", value: "redux"},
            {title: "Zustand", value: "zustand"},
            {title: "Jotai", value: "jotai"},
            {title: "None", value: "none"},
          ],
        },
        {
          type: "select",
          name: "query",
          message: "Query library?",
          choices: [
            {title: "TanStack Query", value: "tanstack-query"},
            {title: "React Query", value: "react-query"},
            {title: "None", value: "none"},
          ],
        },
        {
          type: "toggle",
          name: "queryDevtools",
          message: "Install Query Devtools?",
          initial: false,
        },
        {
          type: "toggle",
          name: "toastify",
          message: "Install React Toastify?",
          initial: true,
        },
      ],
      {
        onCancel: () => {
          console.log(chalk.red("\n❌ Prompt cancelled. Exiting..."));
          process.exit(0);
        },
      }
    );

    config = responses;
  }

  const spinner = ora("Scaffolding your project...").start();

  try {
    await scaffoldProject(config as ScaffoldConfig, spinner);
    spinner.succeed(chalk.green("✨ Project setup complete!"));
  } catch (err) {
    spinner.fail(chalk.red("💥 Failed to scaffold project."));
    console.error(err);
    process.exit(1);
  }
})();
