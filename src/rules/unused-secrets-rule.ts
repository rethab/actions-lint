import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../linter';
import { Rule } from './rule';

export class UnusedSecretsRule extends Rule {
  check(template: MappingToken): Problem[] {
    const declaredSecrets = this.getDeclaredSecrets(template);
    const usedSecrets = this.getUsedSecrets(template);

    const problems = [];

    for (const secretName of declaredSecrets.getObjectKeys()) {
      if (!usedSecrets.map((usedSecret) => usedSecret.name).includes(secretName)) {
        const secret = declaredSecrets.getObjectValue(secretName) as MappingToken;
        problems.push({
          message: `Secret "${secretName}" is not used`,
          position: {
            line: secret.line!,
            column: secret.col!,
          },
        });
      }
    }

    return problems;
  }
}
