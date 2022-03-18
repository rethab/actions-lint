import { parseWorkflow } from '@fusectore/actions-yaml/dist/workflows/workflow-parser';
import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Linter } from './linter';

export function lintWorkflow(yaml: string) {
  const { value } = parseWorkflow(
    'test.yaml',
    [{ name: 'test.yaml', content: yaml }],
    { verbose: console.log, ...console }
  );

  return new Linter().lint(value as MappingToken);
}
