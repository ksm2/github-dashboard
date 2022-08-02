export interface FilterConfig {
  name: string;
  query: Query;
}

export interface Query {
  team?: Condition<string>;
  author?: Condition<string>;
}

export interface Condition<T> {
  $eq?: T;
  $ne?: T;
  $in?: T[];
  $ni?: T[];
}
