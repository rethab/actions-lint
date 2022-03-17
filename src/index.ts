import { parseWorkflow } from '@fusectore/actions-yaml/dist/workflows/workflow-parser';
import { getInput, info, error, setFailed } from '@actions/core';
import fs from 'fs';
import { Linter } from './linter';

function main() {
  const file = getInput('files', { required: true });
  const content = fs.readFileSync(file, 'utf8');
  const { value, errors } = parseWorkflow(
    'test.yaml',
    [{ name: 'test.yaml', content }],
    { verbose: console.log, ...console }
  );
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }
  if (!value) {
    throw new Error('No value');
  }

  const problems = new Linter().lint(value);
  if (problems.length === 0) {
    info('all good :)');
    return;
  }

  for (const problem of problems) {
    error(problem.message);
  }

  setFailed('Found problems');
}

main();
