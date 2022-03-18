import { lintWorkflow } from '../utils';

describe('unused inputs rule', () => {
  it('warns about unused inputs', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
            inputs:
              mode:
                type: string
                default: big-step
                required: false
                
        jobs:
          job:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v2`
    );
    expect(errors).toStrictEqual([
      {
        message: `Input "mode" is not used`,
        position: {
          line: 5,
          column: 17,
        },
      },
    ]);
  });

  it('accepts inputs used as inputs to other actions', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
            inputs:
              mode:
                type: string
                default: big-step
                required: false
                
        jobs:
          job:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v2
                with:
                  repo: \${{ inputs.mode }}
              `
    );
    expect(errors).toHaveLength(0);
  });

  it('accepts inputs used as in run step', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
            inputs:
              mode:
                type: string
                required: true
              expert:
                type: string
                required: true
                
        jobs:
          job:
            runs-on: ubuntu-latest
            steps:
              - run: echo \${{ inputs.mode }}/\${{ inputs.expert }}`
    );
    expect(errors).toHaveLength(0);
  });
});
