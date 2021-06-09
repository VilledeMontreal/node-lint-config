import { ScriptBase } from '@villedemontreal/scripting';
import { prettierCheck } from '../src/prettier';
import { libRoot } from '../src/utils/utils';

export class PrettierScript extends ScriptBase {
  get name(): string {
    return 'prettier';
  }

  get description(): string {
    return `Validate that the project respects the Prettier rules.`;
  }

  protected async main() {
    await prettierCheck(libRoot);
  }
}
