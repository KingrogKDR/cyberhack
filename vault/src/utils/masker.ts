export function maskValue(value: string): string {
  if (value.length < 5) return value;
  return value.slice(0, 2) + "*".repeat(value.length - 4) + value.slice(-2);
}
