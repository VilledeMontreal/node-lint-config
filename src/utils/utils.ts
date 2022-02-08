export { path as appRoot } from 'app-root-path';

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectType } from '../index';

const execFile = require('child_process').execFile;
let tempDirPath: string = null;

// ==========================================
// If this is used from a script executed on
// the lib itself, the current file is inside
// "dist"
// ==========================================
export const libRoot = path.normalize(
  isLintLibItself() ? `${__dirname}/../../..` : `${__dirname}/../..`
);

/**
 * Returns the path to a temp directory.
 * Creates the directory if it doesn't exist yet.
 */
export const getTempDirPath = (): string => {
  if (tempDirPath) {
    return tempDirPath;
  }

  tempDirPath = `${libRoot}/temp`;
  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath);
  }
  return tempDirPath;
};

/**
 * Finds the directory where a package is installed.
 * Throws an error if the package is not found.
 *
 * @see https://stackoverflow.com/a/10121471/843699
 */
export const getPackageRoot = (packageName: string): string => {
  let packagePath = path.dirname(require.resolve(packageName));

  let latest: string = null;
  while (
    !fs.existsSync(`${packagePath}/package.json`) &&
    packagePath !== latest
  ) {
    latest = packagePath;
    packagePath = path.resolve(packagePath, '..');
  }
  if (packagePath === latest) {
    throw new Error(`package.json not found for package "${packageName}".`);
  }

  return packagePath;
};

/**
 * Executes a shell command. Returns a Promise.
 */
export const execPromisified = (
  command: string,
  args: string[]
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const proc = execFile(
      command,
      args,
      { maxBuffer: 1024 * 500 },
      (err: any, out: any, code: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
    /* eslint-enable @typescript-eslint/no-unused-vars */

    proc.stdout.on('data', (data: string) => {
      let dataClean = data;
      if (dataClean && dataClean.endsWith('\n')) {
        dataClean = dataClean.substring(0, dataClean.length - 1);
      }
      // eslint-disable-next-line no-console
      console.log(dataClean);
    });

    proc.stderr.on('data', (data: string) => {
      let dataClean = data;
      if (dataClean && dataClean.endsWith('\n')) {
        dataClean = dataClean.substr(0, dataClean.length - 1);
      }
      // eslint-disable-next-line no-console
      console.error(dataClean);
    });
  });
};

/**
 * Tries to detect the type of the target project.
 * Returns the project type or NULL if it can't be detected.
 */
export const detectProjetType = (projectRoot: string): ProjectType => {
  if (fs.existsSync(`${projectRoot}/open-api`)) {
    return ProjectType.NODE;
  }

  if (fs.existsSync(`${projectRoot}/.angular-cli.json`)) {
    return ProjectType.ANGULAR;
  }

  const packageJsonPath = path.resolve(projectRoot, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  const packageJsonContent = require(packageJsonPath);
  if (packageJsonContent.dependencies) {
    if (packageJsonContent.dependencies['@angular/core']) {
      return ProjectType.ANGULAR;
    }

    if (packageJsonContent.dependencies['body-parser']) {
      return ProjectType.NODE;
    }
  }

  return null;
};

function isLintLibItself() {
  const packageJsonPath = path.resolve(`${__dirname}/../../../package.json`);
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const packageJsonObj = require(packageJsonPath);
  return packageJsonObj.name === '@villedemontreal/lint-config';
}
