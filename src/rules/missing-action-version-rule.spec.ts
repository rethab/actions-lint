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
    expect(problems).toMatchObject([
      {
        message: 'actions/foo has no reference',
        position: { file: 1, line: 4, column: 21 },
      },
    ]);
  });
});
