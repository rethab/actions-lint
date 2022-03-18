import * as Core from '@actions/core';
import { TemplateToken } from '@fusectore/actions-yaml/dist/templates/tokens';

export class Problem {
  constructor(public readonly message: string, public readonly position: Position) {}

  static fromToken(message: string, token: TemplateToken): Problem {
    return new Problem(message, Position.fromToken(token));
  }

  print(core: typeof Core, files: string[]) {
    const { file, line, column } = this.position;
    const filename = files[file - 1];
    core.info(`${filename} (Line: ${line}, Col: ${column}): ${this.message}`);
  }
}

export class Position {
  constructor(
    public readonly file: number,
    public readonly line: number,
    public readonly column: number
  ) {}
  static fromToken(token: TemplateToken): Position {
    return new Position(token.file!, token.line!, token.col!);
  }
}
