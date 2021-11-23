/* eslint-disable no-console */
// Console outputs are OK for a script.
/* tslint:disable:no-console */
import * as fs from 'fs';
import * as path from 'path';
import {
  Action,
  getActionFromString,
  getProjectTypeFromString,
  getValidationTypeFromString,
  ProjectType,
  ValidationType,
} from './models';
import { prettierCheck, prettierFix } from './prettier';
import { eslintCheck, eslintFix } from './eslint';
import { detectProjetType } from './utils/utils';

/**
 * Help message
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const help = (message: string = '') => {
  console.log(`\n`);
  if (message) {
    console.log(`Error : ${message}\n\n`);
  }

  console.log(`==========================================`);
  console.log(`Lint script`);
  console.log(`==========================================\n`);

  console.log(`Use this script to validate/fix a project using the lint rules used by the city of Montreal.

Usage : node_modules/.bin/villemontreal-lint [projectRoot] [action] [projectType] [validationType]

  - "projectRoot" : The relative or absolute path to the root of the project to lint. Defaults to the current directory.
  - "action" : The action to perform. Can be "check", "fix". Defaults to "check".
  - "projectType" : The type of the target project. Can be "angular", "node" or "auto". If "auto" is used,
  the script will try to detect the project type automatically. If not specified, "auto" is used.
  - "validationType" : The type of validation. Can be "prettier", "tslint" or "both". If not specified, "both" is used.
`);
  process.exit(1);
};

const getProjetRoot = (args: string[]): string => {
  let projectRoot: string;
  if (args[0]) {
    const actionParam: string = args[0].toLowerCase();
    if (actionParam === '-help' || actionParam === '--help' || actionParam === '-h' || actionParam === '--h') {
      help();
      return null;
    }

    projectRoot = path.resolve(args[0]);
    if (!fs.existsSync(projectRoot) || !fs.lstatSync(projectRoot).isDirectory()) {
      help(`The specified project root is not a valid directory: ${args[0]}`);
      return null;
    }
    if (!fs.existsSync(`${projectRoot}/package.json`)) {
      help(`No "package.json" file found in the project root: ${args[0]}`);
      return null;
    }
  } else {
    projectRoot = path.resolve('.');
    console.log(`No project root specified. Using current directory : ${projectRoot}`);
  }
  return projectRoot;
};

const getAction = (args: string[]): Action => {
  let action = Action.CHECK;
  if (args[1]) {
    const actionParam = args[1].toLowerCase();
    action = getActionFromString(actionParam);
    if (!action) {
      help(`The parameter "${args[1]}" is not a valid action to perform.`);
      return null;
    }
  }
  return action;
};

const getProjectType = (args: string[], projectRoot: string): ProjectType => {
  let projectType: ProjectType = null;
  if (args[2]) {
    const projectTypeParam: string = args[2].toLowerCase();
    projectType = getProjectTypeFromString(projectTypeParam);
    if (!projectType) {
      help(`The parameter "${args[2]}" is not a valid project type.`);
      return null;
    }
  }

  if (!projectType || projectType === ProjectType.AUTO) {
    projectType = detectProjetType(projectRoot);
    if (!projectType) {
      help(`Unable to detect the project type. Please specify it explicitly.`);
      return null;
    }
    console.log(`Project of type "${projectType}" detected...`);
  }
  return projectType;
};

const getValidationType = (args: string[]): ValidationType => {
  let validationType: ValidationType = ValidationType.BOTH;
  if (args[3]) {
    const validationTypeParam: string = args[3].toLowerCase();
    validationType = getValidationTypeFromString(validationTypeParam);
    if (!validationType) {
      help(`The parameter "${args[3]}" is not a valid validation type.`);
      return null;
    }
  }
  return validationType;
};

/**
 * Lint script
 */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    // ==========================================
    // Parameters
    // ==========================================
    const args = process.argv.slice(2);
    const projectRoot: string = getProjetRoot(args);
    const action: Action = getAction(args);
    const projectType: ProjectType = getProjectType(args, projectRoot);
    const validationType: ValidationType = getValidationType(args);

    // ==========================================
    // Prettier
    // ==========================================
    if (validationType === ValidationType.PRETTIER || validationType === ValidationType.BOTH) {
      if (action === Action.FIX) {
        console.log(`Prettier fix, project root : ${projectRoot}`);
        await prettierFix(projectRoot);
        console.log(`Prettier fix done.`);
      } else if (action === Action.CHECK) {
        console.log(`Prettier check, project root : ${projectRoot}`);
        await prettierCheck(projectRoot);
        console.log(`Prettier check passed.`);
      } else {
        throw new Error(`Unamanaged action "${action}"`);
      }
    }

    // ==========================================
    // TSLint
    // ==========================================
    if (validationType === ValidationType.ESLINT || validationType === ValidationType.BOTH) {
      if (action === Action.FIX) {
        console.log(`TSLint fix, project root : ${projectRoot}`);
        await eslintFix(projectRoot, projectType);
        console.log(`TSLint fix done.`);
      } else if (action === Action.CHECK) {
        console.log(`TSLint check, project root : ${projectRoot}`);
        await eslintCheck(projectRoot, projectType);
        console.log(`TSLint check passed.`);
      } else {
        throw new Error(`Unamanaged action "${action}"`);
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})().catch();
