import { lintWorkflow } from '../utils';

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

  it('recognizes inputs passed to other actions via github.event', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           inputs:
             mode:
               required: true
               type: string
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/something@v1
               with:
                 mode: \${{ github.event.inputs.mode }}`
    );
    expect(errors).toHaveLength(0);
  });

  it('recognizes inputs via github.event', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           inputs:
             mode:
               required: true
               type: string
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - run: echo \${{ github.event.inputs.mode }}`
    );
    expect(errors).toHaveLength(0);
  });

  it('recognizes input passed to env variables in steps', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           inputs:
             mode:
               required: true
               type: string
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/something@v1
               env:
                 MODE: \${{ inputs.mode }}`
    );
    expect(errors).toHaveLength(0);
  });

  it('recognizes input passed to env variables in jobs', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           inputs:
             mode:
               required: true
               type: string
         
       jobs:
         job:
           runs-on: ubuntu-latest
           env:
             MODE: \${{ inputs.mode }}
           steps:
             - uses: actions/something@v1`
    );
    expect(errors).toHaveLength(0);
  });
});
