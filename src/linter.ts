import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { InconsistentActionVersionsRule } from './rules/inconsistent-action-versions-rule';
import { MissingActionVersionRule } from './rules/missing-action-version-rule';
import { RequiredInputWithDefaultRule } from './rules/required-input-with-default-rule';
import { UndeclaredInputsRule } from './rules/undeclared-inputs-rule';
import { UnusedInputsRule } from './rules/unused-inputs-rule';

export interface Position {
  line: number;
  column: number;
}

export interface Problem {
  message: string;
  position: Position;
}

export class Linter {
  lint(template: MappingToken): Problem[] {
    const rules = [
      new UnusedInputsRule(),
      new UndeclaredInputsRule(),
      new InconsistentActionVersionsRule(),
      new MissingActionVersionRule(),
      new RequiredInputWithDefaultRule(),
    ];

    const problems: Problem[] = [];
    for (const rule of rules) {
      const ruleProblems = rule.check(template);
      problems.push(...ruleProblems);
    }

    return problems;
  }
}
