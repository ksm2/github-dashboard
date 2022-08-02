import { PullRequestLoader } from '~/PullRequestLoader';
import { Logger } from './Logger.js';
import { FilterablePullRequest } from './model/FilterablePullRequest.js';
import { RepositoryStorage } from './RepositoryStorage.js';

const ONE_MINUTE = 60 * 1000;

export class PullRequestStorage {
  private readonly logger: Logger;
  private readonly repositoryStorage: RepositoryStorage;
  private readonly pullRequestLoader: PullRequestLoader;

  private pullRequests?: FilterablePullRequest[];
  private lastUpdate?: number;

  constructor(
    logger: Logger,
    repositoryStorage: RepositoryStorage,
    pullRequestLoader: PullRequestLoader,
  ) {
    this.logger = logger;
    this.repositoryStorage = repositoryStorage;
    this.pullRequestLoader = pullRequestLoader;
  }

  async loadPullRequests(): Promise<FilterablePullRequest[]> {
    if (!this.pullRequests || !this.lastUpdate || Date.now() - this.lastUpdate > ONE_MINUTE) {
      this.pullRequests = await this.load();
      this.lastUpdate = Date.now();
    }

    return this.pullRequests;
  }

  private async load(): Promise<FilterablePullRequest[]> {
    this.logger.info('Loading Pull Requests');
    const repositories = await this.repositoryStorage.loadRepositories();
    return this.pullRequestLoader.loadPullRequests(repositories);
  }
}
