export function ensureTrailingSlash(str: string): string {
  if (str.endsWith('/')) {
    return str;
  }

  return str + '/';
}
