import { Logger } from './Logger.js';
import { PullRequestService } from './model/PullRequestService.js';
import { Repository } from './model/Repository.js';

const ONE_HOUR = 60 * 60 * 1000;

export class RepositoryStorage {
  private readonly org: string;
  private readonly logger: Logger;
  private readonly prService: PullRequestService;

  private repositories?: Repository[];
  private lastUpdate?: number;

  constructor(org: string, logger: Logger, prService: PullRequestService) {
    this.org = org;
    this.logger = logger;
    this.prService = prService;
  }

  async loadRepositories(): Promise<Repository[]> {
    if (!this.repositories || !this.lastUpdate || Date.now() - this.lastUpdate > ONE_HOUR) {
      this.repositories = await this.load();
      this.lastUpdate = Date.now();
    }
    return this.repositories;
  }

  private async load(): Promise<Repository[]> {
    this.logger.info('Loading Repositories');
    return this.prService.loadRepositories(this.org);
  }
}
