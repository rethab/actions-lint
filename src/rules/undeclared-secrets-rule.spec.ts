import { lintWorkflow } from '../utils';

describe('undeclared secrets rule', () => {
  it('warns about undeclared secrets passed to other actions', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v2
               with:
                 mode: \${{ secrets.mode }}`
    );
    expect(errors).toMatchObject([
      {
        message: `Secret "mode" is not declared`,
        position: { file: 1, line: 10, column: 24 },
      },
    ]);
  });

  it('warns if only one of the secrets passed to other action is not declared', () => {
    const errors = lintWorkflow(
      `on:
           workflow_call:
             secrets:
               mode:
                 required: false
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v2
               with:
                 mode: \${{ secrets.mode }}/\${{ secrets.mode2 }}/\${{ secrets.mode }}`
    );
    expect(errors).toMatchObject([
      {
        message: `Secret "mode2" is not declared`,
        position: { file: 1, line: 13, column: 24 },
      },
    ]);
  });

  it('warns about undeclared secrets used in run step', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - run: echo \${{ secrets.mode }}/\${{ secrets.expert }}`
    );
    expect(errors).toMatchObject([
      {
        message: `Secret "mode" is not declared`,
        position: {
          file: 1,
          line: 8,
          column: 21,
        },
      },
      {
        message: `Secret "expert" is not declared`,
        position: {
          file: 1,
          line: 8,
          column: 21,
        },
      },
    ]);
  });

  it('recognizes secret passed to env variables in steps', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           secrets:
             mode:
               required: true
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/something@v1
               env:
                 MODE: \${{ secrets.mode }}`
    );
    expect(errors).toHaveLength(0);
  });

  it('recognizes secret passed to env variables in jobs', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           secrets:
             mode:
               required: true
         
       jobs:
         job:
           runs-on: ubuntu-latest
           env:
             MODE: \${{ secrets.mode }}
           steps:
             - uses: actions/something@v1`
    );
    expect(errors).toHaveLength(0);
  });

  it('GITHUB_TOKEN is always available', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - run: echo \${{ secrets.GITHUB_TOKEN }}`
    );
    expect(errors).toHaveLength(0);
  });
});
