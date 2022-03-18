import { BooleanToken, MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../problem';
import { Rule } from './rule';

export class RequiredInputWithDefaultRule extends Rule {
  check(template: MappingToken): Problem[] {
    const problems: Problem[] = [];
    const declaredInputs = this.getDeclaredInputs(template);
    for (const inputKey of declaredInputs.getObjectKeys()) {
      const input = declaredInputs.getObjectValue(inputKey) as MappingToken;
      const hasDefault = input.getObjectValue('default');
      const required = input.getObjectValue('required') as BooleanToken;
      const isRequired = required && required.value;

      if (isRequired && hasDefault) {
        problems.push(
          Problem.fromToken(`Input ${inputKey} is required but has a default value.`, input)
        );
      }
    }
    return problems;
  }
}
