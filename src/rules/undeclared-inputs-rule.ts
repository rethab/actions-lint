import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../problem';
import { Rule } from './rule';

export class UndeclaredInputsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const declaredInputs = this.getDeclaredInputs(template);
    const usedInputs = this.getUsedInputs(template);

    const problems = [];

    for (const usedInput of usedInputs) {
      if (!declaredInputs.getObjectValue(usedInput.name)) {
        problems.push(new Problem(`Input "${usedInput.name}" is not declared`, usedInput.position));
      }
    }

    return problems;
  }
}
