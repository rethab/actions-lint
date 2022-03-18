import { lintWorkflow } from '../utils';

describe('inconsistent action versions rule', () => {
  it('warns about inconsistent reference usage', () => {
    const problems = lintWorkflow(`
      jobs:
        job:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/foo@v1
            - uses: actions/foo@v2
      `);
    expect(problems).toStrictEqual([
      {
        message: 'actions/foo also seen with v2',
        position: { line: 5, column: 21 },
      },
      {
        message: 'actions/foo also seen with v1',
        position: { line: 6, column: 21 },
      },
    ]);
  });

  it('accepts different reference of different actions', () => {
    const problems = lintWorkflow(`
      jobs:
        job:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/foo@v1
            - uses: actions/bar@v2
      `);
    expect(problems).toHaveLength(0);
  });

  it('accepts same reference of same action', () => {
    const problems = lintWorkflow(`
      jobs:
        job:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/foo@v1
            - uses: actions/foo@v1
      `);
    expect(problems).toHaveLength(0);
  });
});
