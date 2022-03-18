import { lintWorkflow } from '../utils';

describe('missing action version rule', () => {
  it('warns about missing reference', () => {
    const problems = lintWorkflow(`
      jobs:
        job:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/foo
      `);
    expect(problems).toStrictEqual([
      {
        message: 'actions/foo has no reference',
        position: { line: 5, column: 21 },
      },
    ]);
  });
});
