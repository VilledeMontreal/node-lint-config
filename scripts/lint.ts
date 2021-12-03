import { ScriptBase } from '@villedemontreal/scripting';
import { PrettierScript } from './prettier';
import { EsLintScript } from './esLint';

export class LintScript extends ScriptBase {
  get name(): string {
    return 'lint';
  }

  get description(): string {
    return `Run the Prettier and ESlint validation.`;
  }

  protected async main() {
    await this.invokeScript(PrettierScript, {}, {});
    await this.invokeScript(EsLintScript, {}, {});
  }
}
