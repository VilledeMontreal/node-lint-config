import { Command } from '@caporal/core';
import { ScriptBase } from '@villedemontreal/scripting';

export class ShowCoverageScript extends ScriptBase {
  get name(): string {
    return 'show-coverage';
  }

  get description(): string {
    return `Dummy script, simply overrides the core script in order to hide it.`;
  }

  protected async configure(command: Command): Promise<void> {
    command.hide();
  }

  protected async main() {
    this.logger.warn(`noop`);
  }
}
