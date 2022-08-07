import { PullRequest } from './PullRequest.js';
import { Query, QueryConfig } from './QueryConfig.js';
import { Repository } from './Repository.js';

export interface FilterConfigJson {
  name: string;
  query: QueryConfig;
}

export class FilterConfig {
  private static readonly usedIds = new Set<string>();

  readonly id: string;
  readonly name: string;
  private readonly query: Query;

  private constructor(name: string, query: Query) {
    this.id = this.buildId(name);
    this.name = name;
    this.query = query;
  }

  private buildId(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    let id = base;
    let idx = 0;
    while (FilterConfig.usedIds.has(id)) {
      idx += 1;
      id = base + idx;
    }
    FilterConfig.usedIds.add(id);

    return id;
  }

  static fromJSON(json: FilterConfigJson) {
    return new FilterConfig(json.name, Query.parse(json.query));
  }

  appliesToRepository(repository: Repository): boolean {
    return this.query.appliesToRepository(repository);
  }

  appliesToPullRequest(pullRequest: PullRequest): boolean {
    return this.query.appliesToPullRequest(pullRequest);
  }
}
