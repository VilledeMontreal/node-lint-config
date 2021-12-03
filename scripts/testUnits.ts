import { ScriptBase } from '@villedemontreal/scripting';
import { libRoot } from '../src/utils/utils';

export class TestUnitsScript extends ScriptBase {
  get name(): string {
    return 'test-units';
  }

  get description(): string {
    return `Run the unit tests.`;
  }

  protected async main() {
    await this.invokeShellCommand(`node`, [`${libRoot}/dist/src/lint.check-test.js`]);
    await this.invokeShellCommand(`node`, [`${libRoot}/dist/src/lint.fix-test.js`]);
    await this.invokeShellCommand(`node`, [
      `${libRoot}/node_modules/eslint/bin/eslint`,
      `--config`,
      `${libRoot}/rules/eslint-angular.json`,
    ]);
    await this.invokeShellCommand(`node`, [
      `${libRoot}/node_modules/eslint/bin/eslint`,
      `--config`,
      `${libRoot}/rules/eslint-node.json`,
    ]);
  }
}
