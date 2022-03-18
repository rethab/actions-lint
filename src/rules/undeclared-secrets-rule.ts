import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from '../problem';
import { Rule } from './rule';

export class UndeclaredSecretsRule extends Rule {
  private predefinedSecrets = ['GITHUB_TOKEN'];

  check(template: MappingToken): Problem[] {
    const declaredSecrets = this.getDeclaredSecrets(template);
    const usedSecrets = this.getUsedSecrets(template);

    const problems = [];

    for (const usedSecret of usedSecrets) {
      if (this.predefinedSecrets.includes(usedSecret.name)) {
        continue;
      }
      if (!declaredSecrets.getObjectValue(usedSecret.name)) {
        problems.push(
          new Problem(`Secret "${usedSecret.name}" is not declared`, usedSecret.position)
        );
      }
    }

    return problems;
  }
}
