// Exceeding function length and console output are
// OK in test files.
// tslint:disable:no-console
// tslint:disable:max-func-body-length
import * as fs from 'fs';
import * as path from 'path';
import { Action, ProjectType, ValidationType } from './index';
import { execPromisified, libRoot } from './utils/utils';

/**
 * Runs lint check on all directories inside the specified "testsRootPath".
 */
const lintCheckSubDirectories = async (
  projectType: ProjectType,
  validationType: ValidationType,
  testsRootPath: string,
  mustSucceed: boolean
) => {
  const testDirs = fs.readdirSync(testsRootPath).filter(f => fs.statSync(path.join(testsRootPath, f)).isDirectory());
  for (const testDirName of testDirs) {
    const testDir = `${testsRootPath}/${testDirName}`;
    const testName = `${projectType} - ${validationType} - ${mustSucceed ? 'must succeed' : 'must fail'} - ${testDir}`;

    console.log(`\n------------------------------------------`);
    console.log(testName);
    console.log(`------------------------------------------`);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        testDir,
        Action.CHECK,
        projectType,
        validationType
      ]);
      if (!mustSucceed) {
        console.error(`\nscript was supposed to fail!\n`);
        process.exit(1);
      }
    } catch (err) {
      if (mustSucceed) {
        console.error(`\ntest failed!\n${err}\n`);
        process.exit(1);
      }
    }
  }
};

/**
 * Runs tests
 */
(async () => {
  console.log(`\n==========================================`);
  console.log(`Lint script - check tests`);
  console.log(`==========================================\n`);

  try {
    // ==========================================
    // Check - No "package.json" - Node
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/noPackageJson`,
      false
    );

    // ==========================================
    // Check - No "package.json" - Angular
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/noPackageJson`,
      false
    );

    // ==========================================
    // Check - No "package.json" - Auto
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/noPackageJson`,
      false
    );

    // ==========================================
    // Check - Angular - Prettier - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/angular/prettier/good`,
      true
    );

    // ==========================================
    // Check - Angular - Prettier - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/angular/prettier/bad`,
      false
    );

    // ==========================================
    // Check - Angular - TSLint - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/angular/tslint/good`,
      true
    );

    // ==========================================
    // Check - Angular - TSLint - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/angular/tslint/bad`,
      false
    );

    // ==========================================
    // Check - Angular - Both - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/angular/both/good`,
      true
    );

    // ==========================================
    // Check - Angular - Both - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.ANGULAR,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/angular/both/bad`,
      false
    );

    // ==========================================
    // Check - Node - Prettier - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/node/prettier/good`,
      true
    );

    // ==========================================
    // Check - Node - Prettier - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/node/prettier/bad`,
      false
    );

    // ==========================================
    // Check - Node - TSLint - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/node/tslint/good`,
      true
    );

    // ==========================================
    // Check - Node - TSLint - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/node/tslint/bad`,
      false
    );

    // ==========================================
    // Check - Node - Both - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/node/both/good`,
      true
    );

    // ==========================================
    // Check - Node - Both - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.NODE,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/node/both/bad`,
      false
    );

    // ==========================================
    // Check - Auto (unable to detect) - Prettier - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/auto_unableToDetect`,
      false
    );

    // ==========================================
    // Check - Auto (unable to detect) - TSLint - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/auto_unableToDetect`,
      false
    );

    // ==========================================
    // Check - Auto (unable to detect) - Both - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/auto_unableToDetect`,
      false
    );

    // ==========================================
    // Check - Auto (Angular) - Prettier - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/auto_angular/prettier/good`,
      true
    );

    // ==========================================
    // Check - Auto (Angular) - Prettier - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/auto_angular/prettier/bad`,
      false
    );

    // ==========================================
    // Check - Auto (Angular) - TSLint - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/auto_angular/tslint/good`,
      true
    );

    // ==========================================
    // Check - Auto (Angular) - TSLint - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/auto_angular/tslint/bad`,
      false
    );

    // ==========================================
    // Check - Auto (Angular) - Both - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/auto_angular/both/good`,
      true
    );

    // ==========================================
    // Check - Auto (Angular) - Both - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/auto_angular/both/bad`,
      false
    );

    // ==========================================
    // Check - Auto (Node) - Prettier - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/auto_node/prettier/good`,
      true
    );

    // ==========================================
    // Check - Auto (Node) - Prettier - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.PRETTIER,
      `${libRoot}/test/resources/lint/check/auto_node/prettier/bad`,
      false
    );

    // ==========================================
    // Check - Auto (Node) - TSLint - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/auto_node/tslint/good`,
      true
    );

    // ==========================================
    // Check - Auto (Node) - TSLint - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.TSLINT,
      `${libRoot}/test/resources/lint/check/auto_node/tslint/bad`,
      false
    );

    // ==========================================
    // Check - Auto (Node) - Both - Must succeed
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/auto_node/both/good`,
      true
    );

    // ==========================================
    // Check - Auto (Node) - Both - Must fail
    // ==========================================
    await lintCheckSubDirectories(
      ProjectType.AUTO,
      ValidationType.BOTH,
      `${libRoot}/test/resources/lint/check/auto_node/both/bad`,
      false
    );

    console.log(`\n==========================================`);
    console.log(`All check tests successful!`);
    console.log(`==========================================\n`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})().catch();
