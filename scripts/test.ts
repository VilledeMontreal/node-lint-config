import { ScriptBase } from '@villedemontreal/scripting';
import { LintScript } from './lint';
import { TestUnitsScript } from './testUnits';

export class TestScript extends ScriptBase {
  get name(): string {
    return 'test';
  }

  get description(): string {
    return `Run the unit tests + the linting validations.`;
  }

  protected async main() {
    await this.invokeScript(LintScript, {}, {});
    await this.invokeScript(TestUnitsScript, {}, {});
  }
}
