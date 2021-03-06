import { lintWorkflow } from '../utils';

describe('required input with default rule', () => {
  it('warns about required inputs with defaults', () => {
    const errors = lintWorkflow(
      `on:
         workflow_call:
           inputs:
             my-input:
               type: string
               default: foo
               required: true
         
       jobs:
         job:
           runs-on: ubuntu-latest
           steps:
             - run: echo \${{ inputs.my-input }}`
    );
    expect(errors).toMatchObject([
      {
        message: 'Input my-input is required but has a default value.',
        position: { file: 1, line: 4, column: 16 },
      },
    ]);
  });
});
