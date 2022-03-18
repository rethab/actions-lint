import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../linter';
import { Rule } from './rule';

export class UnusedInputsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const declaredInputs = this.getDeclaredInputs(template);
    const usedInputs = this.getUsedInputs(template);

    const problems = [];

    for (const inputName of declaredInputs.getObjectKeys()) {
      if (!usedInputs.map((usedInput) => usedInput.name).includes(inputName)) {
        const input = declaredInputs.getObjectValue(inputName) as MappingToken;
        problems.push({
          message: `Input "${inputName}" is not used`,
          position: {
            line: input.line!,
            column: input.col!,
          },
        });
      }
    }

    return problems;
  }
}
