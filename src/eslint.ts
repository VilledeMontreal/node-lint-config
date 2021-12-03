import * as fs from 'fs-extra';
import * as path from 'path';
import { Action, ProjectType } from './models';
import { execPromisified, getPackageRoot, getTempDirPath, libRoot } from './utils/utils';
import { v4 as uuid } from 'uuid';

let eslintRoot: string;
let typescriptRoot: string;

/**
 * Gets the "eslint" package root.
 */
const getEslintRoot = () => {
  if (!eslintRoot) {
    eslintRoot = getPackageRoot('eslint');
  }
  return eslintRoot;
};

/**
 * Gets the "typescript" package root.
 */
const getTypescriptRoot = () => {
  if (!typescriptRoot) {
    typescriptRoot = getPackageRoot('typescript');
  }
  return typescriptRoot;
};

/**
 * Extends an existing tsconfig.json file to make sure the
 * required options are present.
 *
 * @returns the path to a temp *directory* in which the "tsconfig.json"
 * file to use is located. It is the responsability of the calling
 * code to delete this temp directory when it's done with it!
 */
const extendTsconfigWithRequiredOptions = (projectTsConfigPath: string): string => {
  const projectTsConfig = fs.readFileSync(projectTsConfigPath, `utf8`);
  const projectTsConfigObj = JSON.parse(projectTsConfig);

  const projectTsConfigPathClean = projectTsConfigPath.replace(/\\/g, '/');

  const requiredTsConfig = fs.readFileSync(`${libRoot}/rules/tsconfig-required.json`, `utf8`);
  const requiredTsConfigObj = JSON.parse(requiredTsConfig);
  requiredTsConfigObj.extends = projectTsConfigPathClean;

  if (!('include' in projectTsConfigObj) && !('files' in projectTsConfigObj)) {
    const projectPath = path.resolve(`${projectTsConfigPathClean}/..`).replace(/\\/g, '/');
    requiredTsConfigObj.include = [`${projectPath}/**/*.ts`];
  }

  const tempTsconfigDirPath = `${getTempDirPath()}/${uuid()}`;
  fs.mkdirsSync(tempTsconfigDirPath);

  const tempTsconfigPath = `${tempTsconfigDirPath}/tsconfig.json`;
  fs.writeFileSync(tempTsconfigPath, JSON.stringify(requiredTsConfigObj, null, 2), `utf8`);

  return tempTsconfigDirPath;
};

/**
 * ESLint fix.
 *
 * @param projectRoot the root of the project to fix.
 * @param projectType the type of project to fix.
 * @param tsconfigFilePath the path to the "tsconfig.json" file to use. If empty,
 * the one of the fix to fix will be used or, if none exist, a default one will be
 * provided.
 */
export const eslintFix = async (projectRoot: string, projectType: ProjectType, tsconfigFilePath: string = null) => {
  await eslint(Action.FIX, projectRoot, projectType, tsconfigFilePath);
};

/**
 * ESLint check.
 *
 * @param projectRoot the root of the project to check.
 * @param projectType the type of project to check.
 * @param tsconfigFilePath the path to the "tsconfig.json" file to use. If empty,
 * the one of the project to check will be used or, if none exist, a default one will be
 * provided.
 */
export const eslintCheck = async (projectRoot: string, projectType: ProjectType, tsconfigFilePath: string = null) => {
  await eslint(Action.CHECK, projectRoot, projectType, tsconfigFilePath);
};

export const eslint = async (
  action: Action,
  projectRoot: string,
  projectType: ProjectType,
  tsconfigFilePath: string = null
) => {
  const projectRootClean = path.resolve(projectRoot);
  let tsConfigPathClean = tsconfigFilePath;
  let tempDirToDelete: string = null;

  // ==========================================
  // If no tsconfig.json is specified, we take the
  // target project's one.
  // ==========================================
  if (!tsConfigPathClean) {
    tsConfigPathClean = `${projectRootClean}/tsconfig.json`;
    if (!fs.existsSync(tsConfigPathClean)) {
      throw new Error(`A "tsconfig.json" is required at the root of the projet : ${tsConfigPathClean}`);
    }

    // ==========================================
    // We make sure the required compiler options
    // are there.
    // ==========================================
    const tempDirWithTsConfig = extendTsconfigWithRequiredOptions(tsConfigPathClean);
    tsConfigPathClean = `${tempDirWithTsConfig}/tsconfig.json`;
    tempDirToDelete = tempDirWithTsConfig;
  }

  const wd = process.cwd();
  try {
    process.chdir(projectRoot);
    // ==========================================
    // ESLint
    // ==========================================
    try {
      const args: string[] = [
        `${getEslintRoot()}/bin/eslint`,
        `--config`,
        `${libRoot}/rules/eslint-${projectType}.json`,
        `--ext`,
        `.ts`,
        `${projectRootClean}`,
      ];
      if (action === Action.FIX) {
        args.push('--fix');
      }
      await execPromisified(`node`, args);
    } catch (err) {
      if (action === Action.FIX) {
        throw new Error(`ESLint fix failed!\n${err}`);
      } else {
        throw new Error(`ESLint check failed!\n${err}`);
      }
    }

    // ==========================================
    // We also need to *compile* the project, so the
    // tsconfig.json's compiler options are validated.
    // ==========================================
    const outDirPath = `${getTempDirPath()}/${uuid()}`;
    fs.mkdirsSync(outDirPath);

    try {
      await execPromisified(`node`, [`${getTypescriptRoot()}/lib/tsc.js`, `--outDir`, `${outDirPath}`]);
    } catch (err) {
      if (action === Action.FIX) {
        throw new Error(`ESLint fix failed!\n${err}`);
      } else {
        throw new Error(`ESLint check failed!\n${err}`);
      }
    } finally {
      try {
        fs.removeSync(outDirPath);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Unable to delete ${outDirPath}: ${err}`);
      }
    }
  } finally {
    try {
      process.chdir(wd);
    } catch (err) {
      // ok
    }

    // ==========================================
    // Deletes the generated temp directory.
    // ==========================================
    if (tempDirToDelete) {
      try {
        fs.removeSync(tempDirToDelete);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Unable to delete ${tempDirToDelete}: ${err}`);
      }
    }
  }
};
