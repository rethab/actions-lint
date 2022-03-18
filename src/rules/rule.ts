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

export const EmptyMappingToken = new MappingToken(undefined, undefined, undefined);

export abstract class Rule {
  abstract check(template: MappingToken): Problem[];

  getDeclaredInputs(tpl: MappingToken): MappingToken {
    return this.getNestedObjectValue(tpl, 'on', 'workflow_call', 'inputs');
  }

  getDeclaredSecrets(tpl: MappingToken): MappingToken {
    return this.getNestedObjectValue(tpl, 'on', 'workflow_call', 'secrets');
  }

  protected getNestedObjectValue(template: MappingToken, ...path: string[]): MappingToken {
    let current = template;
    for (const key of path) {
      current = current.getObjectValue(key);
      if (!current || !(current instanceof MappingToken)) return EmptyMappingToken;
    }
    return current;
  }

  getUsedInputs(template: MappingToken): UsedInput[] {
    return this.getUsages('input', template);
  }

  getUsedSecrets(template: MappingToken): UsedInput[] {
    return this.getUsages('secret', template);
  }

  private getUsages(type: 'input' | 'secret', template: MappingToken): UsedInput[] {
    const usages: UsedInput[] = [];
    const jobs = template.getObjectValue('jobs') as MappingToken;
    for (const jobKey of jobs.getObjectKeys()) {
      const job = jobs.getObjectValue(jobKey) as MappingToken;

      const env = job.getObjectValue('env');
      if (env) {
        usages.push(...this.getUsageFromMap(type, env));
      }

      const steps = job.getObjectValue('steps') as SequenceToken;
      for (let stepIndex = 0; stepIndex < steps.getArrayLength(); stepIndex++) {
        const step = steps.getArrayItem(stepIndex) as MappingToken;
        const actionInputs = step.getObjectValue('with');
        if (actionInputs) {
          usages.push(...this.getUsageFromMap(type, actionInputs));
        }
        const env = step.getObjectValue('env');
        if (env) {
          usages.push(...this.getUsageFromMap(type, env));
        }
        const runStep = step.getObjectValue('run');
        if (runStep && runStep instanceof BasicExpressionToken) {
          usages.push(...this.getUsageFromExpression(type, runStep));
        }
      }
    }
    return usages;
  }

  getUsageFromMap(type: 'secret' | 'input', map: MappingToken): UsedInput[] {
    const usages: UsedInput[] = [];
    for (const key of map.getObjectKeys()) {
      const value = map.getObjectValue(key);
      if (value instanceof BasicExpressionToken) {
        usages.push(...this.getUsageFromExpression(type, value));
      }
    }
    return usages;
  }

  getUsageFromExpression(type: 'secret' | 'input', expression: BasicExpressionToken): UsedInput[] {
    const position = { line: expression.line!, column: expression.col! };

    const usage = this.getUsageFromExpressionString(type, expression.expression, position);

    if (usage) {
      return [usage];
    }

    const usages: UsedInput[] = [];
    if (expression.expression.startsWith('format(')) {
      // expressions look like so: format('{0}', inputs.foo)
      const argsPosition = expression.expression.lastIndexOf("'");
      const args = expression.expression
        .substring(argsPosition + 3, expression.expression.length - 1)
        .split(',')
        .map((arg) => arg.trim());
      for (const arg of args) {
        const input = this.getUsageFromExpressionString(type, arg, position);
        if (input) {
          usages.push(input);
        }
      }
    }

    return usages;
  }

  getUsageFromExpressionString(
    type: 'secret' | 'input',
    expression: string,
    position: Position
  ): UsedInput | undefined {
    if (type === 'input' && expression.startsWith('inputs.')) {
      return { name: expression.substring(7), position };
    }
    if (type === 'secret' && expression.startsWith('secrets.')) {
      return { name: expression.substring(8), position };
    }
    if (type === 'input' && expression.startsWith('github.event.inputs.')) {
      return { name: expression.substring(20), position };
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
          position: { line: action.line!, column: action.col! },
        });
      }
    }

    return usedActions;
  }
}
