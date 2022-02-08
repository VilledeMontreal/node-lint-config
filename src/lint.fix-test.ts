/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
// ==========================================
// Disabling some linting rules is OK in test files.
// ==========================================

import * as fs from 'fs-extra';
import { v4 as uuid } from 'uuid';
import { Action, ProjectType, ValidationType } from './index';
import { execPromisified, getTempDirPath, libRoot } from './utils/utils';

/**
 * Nothing to fix test
 */
const nothingToFixTest = async () => {
  const testRoot = `${libRoot}/test/resources/lint/fix/nothing-to-fix`;
  const contentBefore = fs.readFileSync(`${testRoot}/test.ts`, 'utf8');

  try {
    await execPromisified(`node`, [
      `${libRoot}/dist/src/lint.js`,
      testRoot,
      Action.FIX,
      ProjectType.NODE,
      ValidationType.BOTH
    ]);
  } catch (err) {
    throw new Error(`\ntest failed!\n${err}\n`);
  }

  const contentAfter = fs.readFileSync(`${testRoot}/test.ts`, 'utf8');
  if (contentAfter !== contentBefore) {
    throw new Error(`\nThe content is different\ntest failed!`);
  }
};

/**
 * Fix both test
 */
const fixPrettierAndTsLint = async () => {
  const testRoot = `${libRoot}/test/resources/lint/fix/fix-both`;

  const tempDir = `${getTempDirPath()}/${uuid()}`;
  console.log(`
  ==========================================
  Prettier check must fail: ${testRoot}
  ==========================================`);
  fs.mkdirsSync(tempDir);
  try {
    fs.copySync(testRoot, tempDir);
    let error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`Prettier check must have failed!`);
    }
    console.log(`
    ==========================================
    ESLint check must fail: ${testRoot}
    ==========================================`);
    error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`ESLint check must have failed!`);
    }
    console.log(`
    ==========================================
    Fix Prettier and ESLint!: ${testRoot}
    ==========================================`);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.FIX,
        ProjectType.NODE,
        ValidationType.BOTH
      ]);
    } catch (err) {
      throw new Error(`\ntest failed!\n${err}\n`);
    }
    console.log(`
    ==========================================
    Prettier check must succeed: ${testRoot}
    ==========================================`);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      throw new Error(`Prettier check must have succeed after the fix!`);
    }
    console.log(`
    ==========================================
    ESLint check must succeed: ${testRoot}
    ==========================================
    `);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      throw new Error(`ESLint check must have succeed after the fix!`);
    }
  } finally {
    try {
      fs.removeSync(tempDir);
    } catch (err) {
      console.warn(`Unable to delete ${tempDir}: ${err}`);
    }
  }
};

/**
 * Fix Prettier test
 */
const fixPrettier = async () => {
  const testRoot = `${libRoot}/test/resources/lint/fix/fix-prettier`;

  const tempDir = `${getTempDirPath()}/${uuid()}`;
  fs.mkdirsSync(tempDir);
  try {
    fs.copySync(testRoot, tempDir);

    // ==========================================
    // Prettier check must fail
    // ==========================================
    let error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`Prettier check must have failed!`);
    }

    // ==========================================
    // ESLint check must fail
    // ==========================================
    error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`Prettier check must have failed!`);
    }

    // ==========================================
    // Fix Prettier!
    // ==========================================
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.FIX,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      throw new Error(`\ntest failed!\n${err}\n`);
    }

    // ==========================================
    // Prettier check must succeed
    // ==========================================
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      throw new Error(`Prettier check must have succeed after the fix!`);
    }

    // ==========================================
    // ESLint check must still fail
    // ==========================================
    error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`ESLint check must have still failed!`);
    }
  } finally {
    try {
      fs.removeSync(tempDir);
    } catch (err) {
      console.warn(`Unable to delete ${tempDir}: ${err}`);
    }
  }
};

/**
 * Fix ESLint test
 */
const fixTslint = async () => {
  const testRoot = `${libRoot}/test/resources/lint/fix/fix-tslint`;

  const tempDir = `${getTempDirPath()}/${uuid()}`;
  fs.mkdirsSync(tempDir);
  try {
    console.log(`
    ==========================================
    Prettier check must fail: ${testRoot}
    ==========================================`);
    fs.copySync(testRoot, tempDir);

    let error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`Prettier check must have failed!`);
    }

    console.log(`
    ==========================================
    ESLint check must fail: ${testRoot}
    ==========================================`);

    error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`ESLint check must have failed!`);
    }
    console.log(`
    ==========================================
    Fix ESLint: ${testRoot}
    ==========================================`);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.FIX,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      throw new Error(`\ntest failed!\n${err}\n`);
    }
    console.log(`
    ==========================================
    Prettier check must still fail: ${testRoot}
    ==========================================`);
    error = false;
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.PRETTIER
      ]);
    } catch (err) {
      error = true;
    }
    if (!error) {
      throw new Error(`Prettier check must have still failed!`);
    }
    console.log(`
    ==========================================
    ESLint check must succeed: ${testRoot}
    ==========================================`);
    try {
      await execPromisified(`node`, [
        `${libRoot}/dist/src/lint.js`,
        tempDir,
        Action.CHECK,
        ProjectType.NODE,
        ValidationType.ESLINT
      ]);
    } catch (err) {
      throw new Error(`ESLint check must have succeed after the fix!`);
    }
  } finally {
    try {
      fs.removeSync(tempDir);
    } catch (err) {
      console.warn(`Unable to delete ${tempDir}: ${err}`);
    }
  }
};

/**
 * Runs tests
 */
(async () => {
  console.log(`\n==========================================`);
  console.log(`Lint script - fix tests`);
  console.log(`==========================================\n`);
  try {
    // ==========================================
    // Fix - Nothing to fix
    // ==========================================
    await nothingToFixTest();

    // ==========================================
    // Fix Prettier and TSLint
    // ==========================================
    await fixPrettierAndTsLint();

    // ==========================================
    // Fix Prettier
    // ==========================================
    await fixPrettier();

    // ==========================================
    // Fix ESLint
    // ==========================================
    await fixTslint();

    console.log(`\n==========================================`);
    console.log(`All fix tests successful!`);
    console.log(`==========================================\n`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})().catch();
