import * as uuid from 'uuid';
import { PullRequest } from './PullRequest.js';
import { Repository } from './Repository.js';

export class FilterConfig {
  readonly id: string;
  readonly name: string;
  private readonly query: Query;

  constructor(name: string, query: Query) {
    this.id = uuid.v4();
    this.name = name;
    this.query = query;
  }

  static fromJSON(json: FilterConfigJson) {
    return new FilterConfig(json.name, json.query);
  }

  appliesToRepository(repository: Repository): boolean {
    let applies = true;
    if (this.query.team) {
      applies = this.matchesCondition(this.query.team, repository.teams);
    }

    return applies;
  }

  appliesToPullRequest(pullRequest: PullRequest): boolean {
    let applies = this.appliesToRepository(pullRequest.repository);
    if (applies && this.query.author) {
      applies = this.matchCondition(this.query.author, pullRequest.author.name);
    }

    return applies;
  }

  private matchesCondition<T>(condition: Condition<T>, values: T[]): boolean {
    return values.some((value) => this.matchCondition(condition, value));
  }

  private matchCondition<T>(condition: Condition<T>, value: T): boolean {
    let applies = true;
    if (condition.$eq !== undefined) {
      applies = value === condition.$eq;
    }
    if (applies && condition.$ne !== undefined) {
      applies = value !== condition.$ne;
    }
    if (applies && condition.$in !== undefined) {
      applies = condition.$in.includes(value);
    }
    if (applies && condition.$ni !== undefined) {
      applies = !condition.$ni.includes(value);
    }
    return applies;
  }
}

export interface FilterConfigJson {
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
