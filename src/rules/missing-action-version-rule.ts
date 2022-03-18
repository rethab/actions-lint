import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../problem';
import { Rule } from './rule';

export class MissingActionVersionRule extends Rule {
  check(template: MappingToken): Problem[] {
    const actions = this.getUsedActions(template);

    const problems = [];

    for (const action of actions) {
      if (action.name.indexOf('@') === -1) {
        problems.push(new Problem(`${action.name} has no reference`, action.position));
      }
    }

    return problems;
  }
}
