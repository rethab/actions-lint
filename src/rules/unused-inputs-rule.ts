import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../problem';
import { Rule } from './rule';

export class UnusedInputsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const declaredInputs = this.getDeclaredInputs(template);
    const usedInputs = this.getUsedInputs(template);

    const problems = [];

    for (const inputName of declaredInputs.getObjectKeys()) {
      if (!usedInputs.map((usedInput) => usedInput.name).includes(inputName)) {
        const input = declaredInputs.getObjectValue(inputName) as MappingToken;
        problems.push(Problem.fromToken(`Input "${inputName}" is not used`, input));
      }
    }

    return problems;
  }
}
