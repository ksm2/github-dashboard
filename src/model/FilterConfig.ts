export interface FilterConfig {
  name: string;
  query: Query;
}

export interface Query {
  team?: Condition<string>;
}

export interface Condition<T> {
  $eq?: T;
}
