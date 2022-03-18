import { parseWorkflow } from '@fusectore/actions-yaml/dist/workflows/workflow-parser';
import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import { Linter } from './linter';
import { NoOperationTraceWriter } from '@fusectore/actions-yaml/dist/templates/trace-writer';

export function lintWorkflow(yaml: string) {
  const { value, errors } = parseWorkflow(
    'test.yaml',
    [{ name: 'test.yaml', content: yaml }],
    new NoOperationTraceWriter()
  );

  if (errors.length !== 0) {
    throw errors[0];
  }

  return new Linter().lint(value as MappingToken);
}
