import { snakeCase } from './snake-case';

export function constantCase(str: string) {
  return snakeCase(str).toUpperCase();
}
