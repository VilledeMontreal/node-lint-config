import { ScriptBase } from '@villemontreal/core-utils-scripting-core-nodejs-lib';
import { ProjectType, tslintFix } from '../src';
import { libRoot } from '../src/utils/utils';

export class TsLintFixScript extends ScriptBase {
  get name(): string {
    return 'tslint-fix';
  }

  get description(): string {
    return (
      `Fix the project formating using the TSLint rules. ` +
      `Note that some errors may not be fixable automatically and may` +
      `need manual help.`
    );
  }

  protected async main() {
    await tslintFix(libRoot, ProjectType.NODE);
  }
}
