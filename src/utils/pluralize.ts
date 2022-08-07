export function pluralize(format: string, num: number) {
  if (num === 1) {
    return format.replaceAll('[s]', '').replaceAll('%d', String(num));
  } else {
    return format.replaceAll('[s]', 's').replaceAll('%d', String(num));
  }
}
