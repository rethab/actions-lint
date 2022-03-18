import { parseWorkflow } from '@fusectore/actions-yaml/dist/workflows/workflow-parser';
import { MappingToken } from '@fusectore/actions-yaml/dist/templates/tokens';
import * as Core from '@actions/core';
import * as Fs from 'fs';
import { Linter } from './linter';
import { NoOperationTraceWriter } from '@fusectore/actions-yaml/dist/templates/trace-writer';

export function run(core: typeof Core, fs: typeof Fs) {
  const file = core.getInput('files', { required: true });
  const content = fs.readFileSync(file, 'utf8');

  core.info('::add-matcher::matcher.json');
  lint(core, file, content);
  core.info('::remove-matcher owner=actions-lint::');
}

function lint(core: typeof Core, filename: string, content: string) {
  const { value, errors } = parseWorkflow(
    filename,
    [{ name: filename, content }],
    new NoOperationTraceWriter()
  );

  if (!value || !(value instanceof MappingToken) || value.getObjectKeys().length === 0) {
    throw new Error(`Not a valid YAML file: ${filename}`);
  }

  if (errors.length > 0) {
    errors.forEach((error) => core.error(error.message));
    core.setFailed(`File ${filename} is invalid`);
    return;
  }

  const problems = new Linter().lint(value);

  if (problems.length === 0 && errors.length === 0) {
    core.info('Linted 1 file');
    return;
  }

  for (const problem of problems) {
    problem.print(core, [filename]);
  }

  core.setFailed('Found problems');
}
