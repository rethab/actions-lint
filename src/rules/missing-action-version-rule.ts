import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../linter';
import { Rule } from './rule';

export class MissingActionVersionRule extends Rule {
  check(template: MappingToken): Problem[] {
    const actions = this.getUsedActions(template);

    const problems = [];

    for (const action of actions) {
      if (action.name.indexOf('@') === -1) {
        problems.push({
          message: `${action.name} has no reference`,
          position: action.position,
        });
      }
    }

    return problems;
  }
}
