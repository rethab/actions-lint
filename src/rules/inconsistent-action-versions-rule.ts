import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Position, Problem } from '../problem';
import { Rule } from './rule';

export class InconsistentActionVersionsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const actions = this.groupActionsByName(template);

    const problems = [];

    for (const [name, coordinates] of actions) {
      for (const { ref, position } of coordinates) {
        const otherVersions = coordinates.filter((coordinate) => coordinate.ref !== ref);
        if (otherVersions.length > 0) {
          problems.push(
            new Problem(
              `${name} also seen with ${otherVersions.map(({ ref }) => ref).join(', ')}`,
              position
            )
          );
        }
      }
    }

    return problems;
  }

  private groupActionsByName(
    template: MappingToken
  ): Map<string, { ref: string; position: Position }[]> {
    const usedActions = this.getUsedActions(template);
    const actionVersions = new Map<string, { position: Position; ref: string }[]>();

    for (const action of usedActions) {
      const at = action.name.indexOf('@');

      if (at === -1) {
        continue;
      }

      const actionName = action.name.substring(0, at);
      const actionVersion = action.name.substring(at + 1);

      const seenVersions = actionVersions.get(actionName) || [];
      seenVersions.push({ ref: actionVersion, position: action.position });
      actionVersions.set(actionName, seenVersions);
    }

    return actionVersions;
  }
}
