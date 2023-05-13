import { readdirSync } from "node:fs";
import micromatch from "micromatch";

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

  const filesToPrettify = [...configFiles, ...jsFiles, ...tsFiles];
  const filesToLint = [...jsFiles, ...tsFiles];
  let commands = [];

  // Run Prettier to format the files
  if (filesToPrettify.length) {
    commands = [...commands, `prettier --write ${filesToPrettify.join(" ")}`];
  }

  // Run a TypeScript check using the tsc compiler on each project that contains
  // the TS files staged for the current commit
  if (tsFiles.length) {
    let workspacesToTypeCheck = [];

    for (const tsFile of tsFiles) {
      const dirs = tsFile.split("/");

      while (dirs.length > 1) {
        dirs.pop();
        const currentPath = dirs.join("/");

        if (workspacesToTypeCheck.includes(currentPath)) {
          break;
        }

        if (readdirSync(currentPath).includes("tsconfig.json")) {
          workspacesToTypeCheck = [...workspacesToTypeCheck, currentPath];
          break;
        }
      }
    }

    if (workspacesToTypeCheck.length) {
      commands = [
        ...commands,
        ...workspacesToTypeCheck.map(
          (workspace) => `tsc --pretty --noEmit -p ${workspace}/tsconfig.json`
        ),
      ];
    }
  }

  // Run ESLint to validate the JS/TS files against the rules defined by the ESLint configuration
  if (filesToLint.length) {
    commands = [...commands, `eslint ${filesToLint.join(" ")}`];
  }

  return commands;
};
