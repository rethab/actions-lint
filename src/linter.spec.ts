import { lintWorkflow } from './utils';

describe('linter misc tests', () => {
  it('parses literal expression', () => {
    expect(
      lintWorkflow(`
    jobs:
      check:
        runs-on: ubuntu-latest
        steps:
          - run: ./foo.sh`)
    ).toHaveLength(0);
  });

  it('parses workflow without inputs', () => {
    expect(
      lintWorkflow(`
      on: 
        workflow_call:
      jobs:
        job:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/hello@v1
      `)
    ).toHaveLength(0);
  });

  it('throws error if required attribute is missing', () => {
    expect(() =>
      lintWorkflow(`
      on: 
        workflow_call: `)
    ).toThrowError(
      'test.yaml (Line: 1, Col: 1) Required property is missing: jobs'
    );
  });
});
