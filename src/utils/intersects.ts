export function intersects<T>(array1: T[], array2: T[]): boolean {
  for (const item of array1) {
    if (array2.includes(item)) {
      return true;
    }
  }
  return false;
}
