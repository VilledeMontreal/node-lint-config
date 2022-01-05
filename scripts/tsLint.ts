import { ScriptBase } from '@villedemontreal/scripting';
import { ProjectType, eslintCheck } from '../src';
import { libRoot } from '../src/utils/utils';

export class TsLintScript extends ScriptBase {
  get name(): string {
    return 'tslint';
  }

  get description(): string {
    return `Validate that the project respect the ESLint rules.`;
  }

  protected async main() {
    await eslintCheck(libRoot, ProjectType.NODE);
  }
}
