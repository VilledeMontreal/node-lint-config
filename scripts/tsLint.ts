import { ScriptBase } from '@villemontreal/core-utils-scripting-core-nodejs-lib';
import { ProjectType, tslintCheck } from '../src';
import { libRoot } from '../src/utils/utils';

export class TsLintScript extends ScriptBase {
  get name(): string {
    return 'tslint';
  }

  get description(): string {
    return `Validate that the project respect the TSLint rules.`;
  }

  protected async main() {
    await tslintCheck(libRoot, ProjectType.NODE);
  }
}
