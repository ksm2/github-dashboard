import { FilterablePullRequest } from '~/model/FilterablePullRequest';
import { FilterConfig } from '~/model/FilterConfig';
import { PullRequestService } from '~/model/PullRequestService';
import { Repository } from '~/model/Repository';

export class PullRequestLoader {
  private readonly org: string;
  private readonly filters: FilterConfig[];
  private readonly prService: PullRequestService;

  constructor(org: string, filters: FilterConfig[], prService: PullRequestService) {
    this.org = org;
    this.filters = filters;
    this.prService = prService;
  }

  async loadPullRequests(repositories: Repository[]): Promise<FilterablePullRequest[]> {
    const filteredRepos = repositories.filter((repo) =>
      this.filters.some((filter) => filter.appliesToRepository(repo)),
    );

    const allPullRequests: FilterablePullRequest[] = [];
    await Promise.all(
      filteredRepos.map(async (repository) => {
        const pullRequests = await this.prService.loadPullRequests(this.org, repository);
        for (const pullRequest of pullRequests) {
          const f = this.filters
            .filter((filter) => filter.appliesToPullRequest(pullRequest))
            .map((f) => f.id);

          allPullRequests.push({ ...pullRequest, filters: f });
        }
      }),
    );

    return allPullRequests;
  }
}
