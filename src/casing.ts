function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function toSnakeCaseKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

export function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function keysToSnakeCase<T>(value: T): T {
  return transformKeys(value, toSnakeCaseKey) as T;
}

export function keysToCamelCase<T>(value: T): T {
  return transformKeys(value, toCamelCaseKey) as T;
}

function transformKeys<T>(value: T, transformKey: (key: string) => string): T {
  if (Array.isArray(value)) {
    return value.map((item) => transformKeys(item, transformKey)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, nested] of Object.entries(value)) {
    result[transformKey(key)] = transformKeys(nested, transformKey);
  }

  return result as T;
}
