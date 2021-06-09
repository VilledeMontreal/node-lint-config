/* tslint:disable:no-console */
import * as fs from 'fs-extra';
import * as path from 'path';
import { Action } from './models';
import { appRoot, execPromisified, libRoot } from './utils/utils';

/**
 * The extensions to format by Prettier.
 */
const prettierDefaultTargets: string[] = ['.ts'];

/**
 * Generates the target string for Prettier.
 */
const generatePrettierTargetString = (projectRoot: string, prettierTargets: string[]): string => {
  /*
  let targetStr = '';
  if (
    prettierTargets &&
    prettierTargets.length > 0 &&
    !(prettierTargets.length === 1 && prettierTargets[0].trim() === '*')
  ) {
    targetStr += '+(';
    for (const [index, target] of prettierTargets.entries()) {
      const targetClean = target.trim();
      targetStr += `${index > 0 ? '|' : ''}${targetClean.startsWith('.') ? '' : '.'}${targetClean}`;
    }
    targetStr += ')';
  }
  */

  // ==========================================
  // It seems using parentheses is problematic
  // on Windows in recent Prettier versions.
  // But, anyway, we only target ".ts" files for
  // now...
  // ==========================================
  // return `${projectRoot}/**/*${targetStr}`;
  return `${projectRoot}/**/*.ts`;
};

/**
 * Prettier fix.
 *
 * @param projectRoot the root of the project to fix.
 * @param prettierIgnoreFilePath the path to the ".prettierignore" file to use. If empty,
 * the one of the project to fix will be used or, if none exist, a default one will be
 * provided.
 */
export const prettierFix = async (projectRoot: string, prettierIgnoreFilePath: string = null) => {
  await prettier(Action.FIX, projectRoot, prettierIgnoreFilePath);
};

/**
 * Prettier check.
 *
 * @param projectRoot the root of the project to check.
 * @param prettierIgnoreFilePath the path to the ".prettierignore" file to use. If empty,
 * the one of the project to check will be used or, if none exist, a default one will be
 * provided.
 */
export const prettierCheck = async (projectRoot: string, prettierIgnoreFilePath: string = null) => {
  await prettier(Action.CHECK, projectRoot, prettierIgnoreFilePath);
};

const prettier = async (action: Action, projectRoot: string, prettierIgnoreFilePath: string = null) => {
  const projectRootClean = path.resolve(projectRoot);

  const prettierTargets = prettierDefaultTargets;

  let prettierIgnoreFilePathClean = prettierIgnoreFilePath;
  if (!prettierIgnoreFilePathClean) {
    prettierIgnoreFilePathClean = `${projectRootClean}/.prettierignore`;
    if (!fs.existsSync(prettierIgnoreFilePathClean)) {
      console.warn(
        `No .prettierignore file found in the project to lint ("${prettierIgnoreFilePathClean}")... Using the default one.`
      );
      prettierIgnoreFilePathClean = `${libRoot}/src/utils/.prettierignore-default`;
    }
  }

  const wd = process.cwd();
  try {
    process.chdir(projectRoot);

    const args: string[] = [
      `--config`,
      `${libRoot}/rules/prettier.config.js`,
      `--ignore-path`,
      prettierIgnoreFilePathClean
    ];

    if (action === Action.FIX) {
      args.push('--write');
    } else {
      args.push('--list-different');
    }

    args.push(generatePrettierTargetString(projectRootClean, prettierTargets));

    const extension = /^win/.test(process.platform) ? '.cmd' : '';
    await execPromisified(`${appRoot}/node_modules/.bin/prettier${extension}`, args);
  } catch (err) {
    if (action === Action.CHECK) {
      throw new Error(`Prettier check failed! (problematic files printed above ↑↑↑)\n${err}`);
    } else {
      throw new Error(`Prettier fix failed!\n${err}`);
    }
  } finally {
    process.chdir(wd);
  }
};
