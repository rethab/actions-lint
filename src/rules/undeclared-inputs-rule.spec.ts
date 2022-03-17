import { lintWorkflow } from '../linter.spec';

describe('undeclared inputs rule', () => {
  it('warns about undeclared inputs passed to other actions', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v2
               with:
                 mode: \${{ inputs.mode }}`
    );
    expect(errors).toStrictEqual([
      {
        message: `Input "mode" is not declared`,
        position: {
          line: 10,
          column: 24,
        },
      },
    ]);
  });

  it('warns if only one of the inputs passed to other action is not declared', () => {
    const errors = lintWorkflow(
      `on:
           workflow_call:
             inputs:
               mode:
                 required: false
                 default: foo
                 type: string
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v2
               with:
                 mode: \${{ inputs.mode }}/\${{ inputs.mode2 }}/\${{ inputs.mode }}`
    );
    expect(errors).toStrictEqual([
      {
        message: `Input "mode2" is not declared`,
        position: {
          line: 15,
          column: 24,
        },
      },
    ]);
  });

  it('warns about undeclared inputs used in run step', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - run: echo \${{ inputs.mode }}/\${{ inputs.expert }}`
    );
    expect(errors).toStrictEqual([
      {
        message: `Input "mode" is not declared`,
        position: {
          line: 8,
          column: 21,
        },
      },
      {
        message: `Input "expert" is not declared`,
        position: {
          line: 8,
          column: 21,
        },
      },
    ]);
  });
});
