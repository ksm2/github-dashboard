export function groupBy<T, K>(
  items: T[],
  keyExtractor: (item: T) => K,
  compareFn: (i1: T, i2: T) => number,
): Map<K, T> {
  const map = new Map<K, T>();
  for (const item of items) {
    const key = keyExtractor(item);
    if (map.has(key)) {
      const compare = compareFn(map.get(key)!, item);
      map.set(key, compare <= 0 ? map.get(key)! : item);
    } else {
      map.set(key, item);
    }
  }
  return map;
}
