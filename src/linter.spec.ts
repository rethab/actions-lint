import { parseWorkflow } from '@fusectore/actions-yaml/dist/workflows/workflow-parser';
import { Linter } from './linter';

describe('linter', () => {
  it.todo('enables rules by config');
});

export function lintWorkflow(yaml: string) {
  const { value, errors } = parseWorkflow(
    'test.yaml',
    [{ name: 'test.yaml', content: yaml }],
    { verbose: console.log, ...console }
  );
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }
  if (!value) {
    throw new Error('No value');
  }

  return new Linter().lint(value);
}
