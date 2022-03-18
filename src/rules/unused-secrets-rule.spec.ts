import { lintWorkflow } from '../utils';

describe('unused secrets rule', () => {
  it('warns about unused secrets', () => {
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
              - uses: actions/checkout@v2`
    );
    expect(errors).toMatchObject([
      {
        message: `Secret "mode" is not used`,
        position: { file: 1, line: 5, column: 17 },
      },
    ]);
  });

  it('accepts secrets used as secrets to other actions', () => {
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
                  repo: \${{ secrets.mode }}
              `
    );
    expect(errors).toHaveLength(0);
  });

  it('accepts secrets used in run step', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
            secrets:
              mode:
                required: true
              expert:
                required: true
                
        jobs:
          job:
            runs-on: ubuntu-latest
            steps:
              - run: echo \${{ secrets.mode }}/\${{ secrets.expert }}`
    );
    expect(errors).toHaveLength(0);
  });

  it('cannot use secrets via github.event', () => {
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
              - run: echo \${{ github.event.secrets.mode }}`
    );
    expect(errors).toMatchObject([
      {
        message: 'Secret "mode" is not used',
        position: { file: 1, line: 5, column: 17 },
      },
    ]);
  });
});
