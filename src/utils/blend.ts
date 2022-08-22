export function blend(c1: string, c2: string, factor: number): string {
  const f1 = clamp(0, 1, factor);
  const f2 = 1 - f1;
  const [r1, g1, b1] = decomposeColor(c1);
  const [r2, g2, b2] = decomposeColor(c2);
  return composeColor(r1 * f1 + r2 * f2, g1 * f1 + g2 * f2, b1 * f1 + b2 * f2);
}

function clamp(minValue: number, maxValue: number, value: number): number {
  return value > maxValue ? maxValue : value < minValue ? minValue : value;
}

function decomposeColor(color: string): [number, number, number] {
  if (color.length === 6) {
    return [
      parseColorComponent(color, 0),
      parseColorComponent(color, 2),
      parseColorComponent(color, 4),
    ];
  }

  return [0, 0, 0];
}

function parseColorComponent(color: string, start: number) {
  const int = parseInt(color.slice(start, start + 2), 16);
  return Number.isNaN(int) ? 0 : int;
}

function composeColor(r: number, g: number, b: number): string {
  return `${stringifyColorComponent(r)}${stringifyColorComponent(g)}${stringifyColorComponent(b)}`;
}

function stringifyColorComponent(c: number): string {
  return Math.trunc(c).toString(16).padStart(2, '0');
}
