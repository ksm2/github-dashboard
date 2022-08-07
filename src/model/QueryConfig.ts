import { PullRequest } from './PullRequest.js';
import { Repository } from './Repository.js';

export abstract class Query {
  abstract appliesToRepository(repository: Repository): boolean;
  abstract appliesToPullRequest(pullRequest: PullRequest): boolean;

  static parse(config: QueryConfig): Query {
    if (config.$or) {
      return new Disjunction(config.$or.map((q) => Query.parse(q)));
    }

    const queries: Query[] = [];
    if (config.team) {
      queries.push(new TeamTerm(config.team));
    }
    if (config.author) {
      queries.push(new AuthorTerm(config.author));
    }
    return queries.length == 1 ? queries[0] : new Conjunction(queries);
  }
}

class Disjunction extends Query {
  private readonly terms: Query[];

  constructor(terms: Query[]) {
    super();
    this.terms = terms;
  }

  appliesToPullRequest(pullRequest: PullRequest): boolean {
    return this.terms.some((term) => term.appliesToPullRequest(pullRequest));
  }

  appliesToRepository(repository: Repository): boolean {
    return this.terms.some((term) => term.appliesToRepository(repository));
  }
}

class Conjunction extends Query {
  private readonly terms: Query[];

  constructor(terms: Query[]) {
    super();
    this.terms = terms;
  }

  appliesToPullRequest(pullRequest: PullRequest): boolean {
    return this.terms.every((term) => term.appliesToPullRequest(pullRequest));
  }

  appliesToRepository(repository: Repository): boolean {
    return this.terms.every((term) => term.appliesToRepository(repository));
  }
}

abstract class Term extends Query {
  private readonly condition: Condition;

  constructor(value: Condition) {
    super();
    this.condition = value;
  }

  protected matchCondition(values: string[]): boolean {
    return values.some((value) => this.matchesCondition(value));
  }

  protected matchesCondition(value: string): boolean {
    let applies = true;
    if (this.condition.$eq !== undefined) {
      applies = value === this.condition.$eq;
    }
    if (applies && this.condition.$ne !== undefined) {
      applies = value !== this.condition.$ne;
    }
    if (applies && this.condition.$in !== undefined) {
      applies = this.condition.$in.includes(value);
    }
    if (applies && this.condition.$ni !== undefined) {
      applies = !this.condition.$ni.includes(value);
    }
    return applies;
  }
}

class TeamTerm extends Term {
  appliesToPullRequest(pullRequest: PullRequest): boolean {
    return this.matchCondition(pullRequest.repository.teams);
  }

  appliesToRepository(repository: Repository): boolean {
    return this.matchCondition(repository.teams);
  }
}

class AuthorTerm extends Term {
  appliesToPullRequest(pullRequest: PullRequest): boolean {
    return this.matchesCondition(pullRequest.author.name);
  }

  appliesToRepository(repository: Repository): boolean {
    return true;
  }
}

export interface QueryConfig {
  $or?: QueryConfig[];
  team?: Condition;
  author?: Condition;
}

export interface Condition {
  $eq?: string;
  $ne?: string;
  $in?: string[];
  $ni?: string[];
}