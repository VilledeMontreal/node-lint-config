import { ScriptBase } from '@villedemontreal/scripting';
import { PrettierFixScript } from './prettierFix';
import { EsLintFixScript } from './esLintFix';

export class LintFixScript extends ScriptBase {
  get name(): string {
    return 'lint-fix';
  }

  get description(): string {
    return (
      `Fix the project formating using the Prettier rules` +
      `and the ESLint rules. Note that some ESLint errors may not` +
      `be fixable automatically and may need manual help.`
    );
  }

  protected async main() {
    await this.invokeScript(PrettierFixScript, {}, {});
    await this.invokeScript(EsLintFixScript, {}, {});
  }
}
