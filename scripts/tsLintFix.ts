import { ScriptBase } from '@villedemontreal/scripting';
import { ProjectType, eslintFix } from '../src';
import { libRoot } from '../src/utils/utils';

export class TsLintFixScript extends ScriptBase {
  get name(): string {
    return 'tslint-fix';
  }

  get description(): string {
    return (
      `Fix the project formating using the ESLint rules. ` +
      `Note that some errors may not be fixable automatically and may` +
      `need manual help.`
    );
  }

  protected async main() {
    await eslintFix(libRoot, ProjectType.NODE);
  }
}
