import * as Core from '@actions/core';
import * as Fs from 'fs';
import { run } from './action';

describe('action', () => {
  it('reads the file specified as input', () => {
    const { core, fs } = setup({ workflow: validWorkflow });

    run(core, fs);

    expect(core.getInput).toHaveBeenCalledWith('files', { required: true });
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/file.yml', 'utf8');
  });

  it('runs the action without problems', () => {
    const { core, fs } = setup({ workflow: validWorkflow });

    run(core, fs);

    expect(core.error).not.toHaveBeenCalled();
  });

  it('fails the action if the workflow is not valid', () => {
    const { core, fs } = setup({ workflow: invalidWorkflow });

    run(core, fs);

    expect(core.error).toHaveBeenCalledWith(
      '/path/to/file.yml (Line: 5, Col: 5) Required property is missing: runs-on'
    );
    expect(core.setFailed).toHaveBeenCalledWith('File /path/to/file.yml is invalid');
  });

  it('fails the action if the workflow contains linter problems', () => {
    const { core, fs } = setup({ workflow: problematicWorkflow });

    run(core, fs);

    expect(core.error).toHaveBeenCalledWith('Input "mode" is not declared');
    expect(core.setFailed).toHaveBeenCalledWith('Found problems');
  });

  it('throws an error if the input file is empty', () => {
    const { core, fs } = setup({ workflow: '' });

    expect(() => run(core, fs)).toThrow('Not a valid YAML file: /path/to/file.yml');
  });

  it('throws an error if the input file is not a valid workflow', () => {
    const { core, fs } = setup({ workflow: '{' });

    expect(() => run(core, fs)).toThrow('Not a valid YAML file: /path/to/file.yml');
  });

  // linting invalid files mean we cannot make any assumptions about the structure
  // while linting so we need to add tons of checks
  it('does not lint if the workflow is invalid', () => {
    const { core, fs } = setup({ workflow: invalidAndProblematicWorkflow });

    run(core, fs);

    expect(core.error).toHaveBeenCalledTimes(1);
    expect(core.error).toHaveBeenCalledWith(
      '/path/to/file.yml (Line: 5, Col: 5) Required property is missing: runs-on'
    );
    expect(core.setFailed).toHaveBeenCalledWith('File /path/to/file.yml is invalid');
  });
});

function setup(config: { workflow: string }) {
  const core = {
    getInput: jest.fn().mockReturnValue('/path/to/file.yml'),
    info: jest.fn(),
    error: jest.fn(),
    setFailed: jest.fn(),
  } as unknown as typeof Core;

  const fs = {
    readFileSync: jest.fn().mockReturnValue(config.workflow),
  } as unknown as typeof Fs;

  return { core, fs };
}

const validWorkflow = `
on:
  workflow_call:
    inputs:
      mode:
        required: false
        type: string
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/check-license@v2
        with:
          mode: \${{ inputs.mode }}
`;

const invalidWorkflow = `
on:
  workflow_call:
jobs:
  check:
    steps:
      - uses: actions/check-license@v2
`;

const problematicWorkflow = `
on:
  workflow_call:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/check-license@v2
        with:
          mode: \${{ inputs.mode }}
`;

const invalidAndProblematicWorkflow = `
on:
  workflow_call:
jobs:
  check:
    steps:
      - uses: actions/check-license@v2
        with:
          mode: \${{ inputs.mode }}
`;
