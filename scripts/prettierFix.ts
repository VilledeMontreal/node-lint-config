import { ScriptBase } from '@villemontreal/core-utils-scripting-core-nodejs-lib';
import { prettierFix } from '../src/prettier';
import { libRoot } from '../src/utils/utils';

export class PrettierFixScript extends ScriptBase {
  get name(): string {
    return 'prettier-fix';
  }

  get description(): string {
    return `Fix the project formating using the Prettier rules.`;
  }

  protected async main() {
    await prettierFix(libRoot);
  }
}
