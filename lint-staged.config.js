import { readdirSync } from "node:fs";
import micromatch from "micromatch";

/**
 * Find the workspaces corresponding to the given list of files and the
 * given root file name.
 * @param {string[]} files the files from which to search the workspaces
 * @param {string} workspaceRootFile the root file of a workspace to find
 * @returns the list of workspaces found
 */
const getWorkspaces = (files, workspaceRootFile) => {
  let workspaces = [];

  for (const file of files) {
    const dirs = file.split("/");

    while (dirs.length > 1) {
      dirs.pop();
      const currentPath = dirs.join("/");

      if (workspaces.includes(currentPath)) {
        break;
      }

      if (readdirSync(currentPath).includes(workspaceRootFile)) {
        workspaces = [...workspaces, currentPath];
        break;
      }
    }
  }

  return workspaces;
};

/**
 * This function runs during the Git pre-commit hook.
 * It is used to run Prettier, a TypeScript check and an ESLint check on all staged
 * files before the commit actually happens.
 * The commit will be aborted if an error occurs.
 * @param {string[]} stageedFiles the files currently staged for the commit
 * @returns {string[]} the commands to run
 */
export default (stagedFiles) => {
  const configFiles = micromatch(stagedFiles, ["**/*.{json,yaml,yml}"]);
  const jsFiles = micromatch(stagedFiles, ["**/*.{js,cjs,mjs}"]);
  const tsFiles = micromatch(stagedFiles, ["**/*.ts"]);
  const svelteFiles = micromatch(stagedFiles, ["**/*.svelte"]);

  const filesToPrettify = [
    ...configFiles,
    ...jsFiles,
    ...tsFiles,
    ...svelteFiles,
  ];
  const filesToLint = [...jsFiles, ...tsFiles, ...svelteFiles];
  let commands = [];

  // Run Prettier to format the files
  if (filesToPrettify.length) {
    commands = [...commands, `prettier --write ${filesToPrettify.join(" ")}`];
  }

  // Run a Svelte check on each project that contains the Svelte files
  // staged for the current commit
  if (svelteFiles.length) {
    const svelteProjects = getWorkspaces(svelteFiles, "svelte.config.js");

    if (svelteProjects.length) {
      commands = [
        ...commands,
        ...svelteProjects.map(
          (svelteProject) =>
            `svelte-check --workspace ${svelteProject} --tsconfig ./tsconfig.json`
        ),
      ];
    }
  }

  // Run a TypeScript check using the tsc compiler on each project that contains
  // the TS files staged for the current commit
  if (tsFiles.length) {
    const tsProjects = getWorkspaces(tsFiles, "tsconfig.json");

    if (tsProjects.length) {
      commands = [
        ...commands,
        ...tsProjects.map(
          (tsProject) => `tsc --pretty --noEmit -p ${tsProject}/tsconfig.json`
        ),
      ];
    }
  }

  // Run ESLint to validate the JS/TS/Svelte files against the rules defined by
  // the ESLint configuration
  if (filesToLint.length) {
    commands = [...commands, `eslint ${filesToLint.join(" ")}`];
  }

  return commands;
};
