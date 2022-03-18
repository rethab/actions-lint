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
      const inputs = workflowCall.getObjectValue('inputs');
      if (inputs instanceof MappingToken) {
        return inputs;
      }
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
        const runStep = step.getObjectValue('run');
        if (runStep && runStep instanceof BasicExpressionToken) {
          inputs.push(...this.getInputsFromExpression(runStep));
        }
      }
    }
    return inputs;
  }

  getInputsFromExpression(expression: BasicExpressionToken): UsedInput[] {
    const position = { line: expression.line!, column: expression.col! };

    const input = this.getInputFromExpressionString(
      expression.expression,
      position
    );

    if (input) {
      return [input];
    }

    const inputs: UsedInput[] = [];
    if (expression.expression.startsWith('format(')) {
      // expressions look like so: format('{0}', inputs.foo)
      const argsPosition = expression.expression.lastIndexOf("'");
      const args = expression.expression
        .substring(argsPosition + 3, expression.expression.length - 1)
        .split(',')
        .map((arg) => arg.trim());
      for (const arg of args) {
        const input = this.getInputFromExpressionString(arg, position);
        if (input) {
          inputs.push(input);
        }
      }
    }

    return inputs;
  }

  getInputFromExpressionString(
    expression: string,
    position: Position
  ): UsedInput | undefined {
    if (expression.startsWith('inputs.')) {
      return {
        name: expression.substring(7),
        position: position,
      };
    }
    if (expression.startsWith('github.event.inputs.')) {
      return {
        name: expression.substring(20),
        position: position,
      };
    }

    return undefined;
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
