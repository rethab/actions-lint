import {
  BasicExpressionToken,
  MappingToken,
  SequenceToken,
  StringToken,
} from '@fusectore/actions-yaml/dist/templates/tokens';
import { Position, Problem } from '../linter';

export interface UsedInput {
  name: string;
  position: Position;
}

export interface UsedAction {
  name: string;
  position: Position;
}

export const EmptyMappingToken = new MappingToken(
  undefined,
  undefined,
  undefined
);

export abstract class Rule {
  abstract check(template: MappingToken): Problem[];

  getDeclaredInputs(template: MappingToken): MappingToken {
    const triggers = template.getObjectValue('on') as MappingToken;
    if (!triggers) return EmptyMappingToken;
    const workflowCall = triggers.getObjectValue('workflow_call');
    if (workflowCall instanceof MappingToken) {
      return workflowCall.getObjectValue('inputs') as MappingToken;
    }
    return EmptyMappingToken;
  }

  getUsedInputs(template: MappingToken): UsedInput[] {
    const inputs: UsedInput[] = [];
    const jobs = template.getObjectValue('jobs') as MappingToken;
    for (const jobKey of jobs.getObjectKeys()) {
      const job = jobs.getObjectValue(jobKey) as MappingToken;
      const steps = job.getObjectValue('steps') as SequenceToken;
      for (let stepIndex = 0; stepIndex < steps.getArrayLength(); stepIndex++) {
        const step = steps.getArrayItem(stepIndex) as MappingToken;
        const actionInputs = step.getObjectValue('with') as MappingToken;
        if (actionInputs) {
          for (const actionInputKey of actionInputs.getObjectKeys()) {
            const actionInput = actionInputs.getObjectValue(actionInputKey);
            if (actionInput instanceof BasicExpressionToken) {
              inputs.push(...this.getInputsFromExpression(actionInput));
            }
          }
        }
        const runStep = step.getObjectValue('run') as BasicExpressionToken;
        if (runStep) {
          inputs.push(...this.getInputsFromExpression(runStep));
        }
      }
    }
    return inputs;
  }

  getInputsFromExpression(expression: BasicExpressionToken): UsedInput[] {
    const inputs: UsedInput[] = [];

    if (expression.expression.startsWith('inputs.')) {
      inputs.push({
        name: expression.expression.substring(7),
        position: {
          line: expression.line!,
          column: expression.col!,
        },
      });
    } else if (expression.expression.startsWith('format(')) {
      // expressions look like so: format('{0}', inputs.foo
      const argsPosition = expression.expression.lastIndexOf("'");
      const args = expression.expression
        .substring(argsPosition + 3, expression.expression.length - 1)
        .split(',')
        .map((arg) => arg.trim());
      for (const arg of args) {
        if (arg.startsWith('inputs.')) {
          inputs.push({
            name: arg.substring(7),
            position: {
              line: expression.line!,
              column: expression.col!,
            },
          });
        }
      }
    }

    return inputs;
  }

  getUsedActions(template: MappingToken): UsedAction[] {
    const jobs = template.getObjectValue('jobs') as MappingToken;
    const usedActions: UsedAction[] = [];
    for (const jobKey of jobs.getObjectKeys()) {
      const job = jobs.getObjectValue(jobKey) as MappingToken;
      const steps = job.getObjectValue('steps') as SequenceToken;
      for (let stepIndex = 0; stepIndex < steps.getArrayLength(); stepIndex++) {
        const step = steps.getArrayItem(stepIndex) as MappingToken;
        const action = step.getObjectValue('uses') as StringToken;
        if (!action) continue;
        usedActions.push({
          name: action.value,
          position: {
            line: action.line!,
            column: action.col!,
          },
        });
      }
    }

    return usedActions;
  }
}
