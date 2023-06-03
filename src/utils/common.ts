export function isDefined<TValue>(value: TValue): value is NonNullable<TValue> {
  return value !== null && value !== undefined;
}

export function isIn<T extends object>(
  key: PropertyKey,
  obj: T
): key is keyof T {
  return key in obj;
}
