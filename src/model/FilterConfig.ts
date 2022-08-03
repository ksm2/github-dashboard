import * as uuid from 'uuid';
import { PullRequest } from './PullRequest.js';
import { Query, QueryConfig } from './QueryConfig.js';
import { Repository } from './Repository.js';

export interface FilterConfigJson {
  name: string;
  query: QueryConfig;
}

export class FilterConfig {
  readonly id: string;
  readonly name: string;
  private readonly query: Query;

  private constructor(name: string, query: Query) {
    this.id = uuid.v4();
    this.name = name;
    this.query = query;
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
