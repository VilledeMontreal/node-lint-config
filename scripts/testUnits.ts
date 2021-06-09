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
      `${libRoot}/node_modules/tslint/bin/tslint`,
      `--config`,
      `${libRoot}/rules/tslint-angular.json`,
      `--project`,
      `${libRoot}/test/angular/tsconfig.json`
    ]);
    await this.invokeShellCommand(`node`, [
      `${libRoot}/node_modules/tslint/bin/tslint`,
      `--config`,
      `${libRoot}/rules/tslint-node.json`,
      `--project`,
      `${libRoot}/test/node/tsconfig.json`
    ]);
  }
}
