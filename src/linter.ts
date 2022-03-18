import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Problem } from './problem';
import { InconsistentActionVersionsRule } from './rules/inconsistent-action-versions-rule';
import { MissingActionVersionRule } from './rules/missing-action-version-rule';
import { RequiredInputWithDefaultRule } from './rules/required-input-with-default-rule';
import { UndeclaredInputsRule } from './rules/undeclared-inputs-rule';
import { UndeclaredSecretsRule } from './rules/undeclared-secrets-rule';
import { UnusedInputsRule } from './rules/unused-inputs-rule';
import { UnusedSecretsRule } from './rules/unused-secrets-rule';

export class Linter {
  lint(template: MappingToken): Problem[] {
    const rules = [
      new UnusedInputsRule(),
      new UndeclaredInputsRule(),
      new InconsistentActionVersionsRule(),
      new MissingActionVersionRule(),
      new RequiredInputWithDefaultRule(),
      new UndeclaredSecretsRule(),
      new UnusedSecretsRule(),
    ];

    const problems: Problem[] = [];
    for (const rule of rules) {
      const ruleProblems = rule.check(template);
      problems.push(...ruleProblems);
    }

    return problems;
  }
}
