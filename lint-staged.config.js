import { readdirSync } from "node:fs";
import micromatch from "micromatch";

/**
 * Filters the list of files to only return the ones that match the glob patterns.
 * @param {string[]} files the list of files
 * @param {string[]} patterns the glob patterns to match
 * @returns the files matching the glob patterns
 */
const getFilePathsForPatterns = (files, patterns) =>
  micromatch(files, patterns).map((path) => path.replace(process.cwd(), "."));

/**
 * Find the workspaces corresponding to the given list of files and the given root files options.
 * @param {string[]} files the files from which to search the workspaces
 * @param {string[]} rootFiles.include the files that should be in the workspace root
 * @param {string[]} rootFiles.exclude the files that should not be in the workspace root
 * @returns the list of workspaces found
 */
const getWorkspaces = (files, rootFiles) => {
  let workspaces = [];

  if (!rootFiles.exclude) {
    rootFiles.exclude = [];
  }

  for (const file of files) {
    const dirs = file.split("/");

    while (dirs.length > 2) {
      dirs.pop();
      const currentPath = dirs.join("/");

      if (workspaces.includes(currentPath)) {
        break;
      }

      const dirFiles = readdirSync(currentPath);

      if (
        rootFiles.include.every((includedRootFile) =>
          dirFiles.includes(includedRootFile)
        )
      ) {
        if (rootFiles.exclude.length) {
          if (
            rootFiles.exclude.every(
              (excludedRootFile) => !dirFiles.includes(excludedRootFile)
            )
          ) {
            workspaces = [...workspaces, currentPath];
            break;
          }
        } else {
          workspaces = [...workspaces, currentPath];
          break;
        }
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
  const configFiles = getFilePathsForPatterns(stagedFiles, [
    "**/*.{json,yaml,yml}",
  ]);
  const jsFiles = getFilePathsForPatterns(stagedFiles, ["**/*.{js,cjs,mjs}"]);
  const tsFiles = getFilePathsForPatterns(stagedFiles, ["**/*.ts"]);
  const svelteFiles = getFilePathsForPatterns(stagedFiles, ["**/*.svelte"]);

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

  // Run a Svelte check on each Svelte project that contains changes with the
  // currently staged files of this commit (a TypeScript check will also be
  // made in all TS and Svelte files of each Svelte project)
  if ([...tsFiles, ...svelteFiles].length) {
    const svelteProjects = getWorkspaces([...tsFiles, ...svelteFiles], {
      include: ["svelte.config.js"],
    });

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
  // the TS files staged for the current commit except those located in a Svelte
  // project (already checked by the `svelte-check` command)
  if (tsFiles.length) {
    const tsProjects = getWorkspaces(tsFiles, {
      include: ["tsconfig.json"],
      exclude: ["svelte.config.js"],
    });

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
