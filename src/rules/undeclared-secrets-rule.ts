import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../linter';
import { Rule } from './rule';

export class UndeclaredSecretsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const declaredSecrets = this.getDeclaredSecrets(template);
    const usedSecrets = this.getUsedSecrets(template);

    const problems = [];

    for (const usedSecret of usedSecrets) {
      if (!declaredSecrets.getObjectValue(usedSecret.name)) {
        problems.push({
          message: `Secret "${usedSecret.name}" is not declared`,
          position: usedSecret.position,
        });
      }
    }

    return problems;
  }
}
