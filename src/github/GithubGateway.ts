import { PullRequest } from '../model/PullRequest.js';
import { PullRequestService } from '../model/PullRequestService.js';
import { Status } from '../model/Status.js';
import { groupBy } from '../utils/groupBy.js';
import { GithubClient } from './GithubClient.js';
import { GitHubPullRequest, GitHubRepo, GitHubReview, GitHubTeam } from './types.js';

interface GitHubRepoPullRequest {
  repo: GitHubRepo;
  pulls: GitHubPullRequest[];
  teams: GitHubTeam[];
}

export class GithubGateway implements PullRequestService {
  private readonly client: GithubClient;
  private readonly org: string;
  private cachedRepos?: GitHubRepo[];
  private lastReposUpdate?: number;

  constructor(client: GithubClient, org: string) {
    this.client = client;
    this.org = org;
  }

  private static groupReviews(reviews: GitHubReview[]): Map<string, GitHubReview> {
    return groupBy(
      reviews,
      (r) => r.user!.login,
      (r1, r2) => new Date(r2.submitted_at!).getTime() - new Date(r1.submitted_at!).getTime(),
    );
  }

  async loadPullRequests(): Promise<PullRequest[]> {
    const repositories = await this.loadPulls();
    return Promise.all(
      repositories.flatMap(({ repo, pulls, teams }) => {
        return pulls.map(
          async (pr): Promise<PullRequest> => ({
            href: pr.html_url,
            title: pr.title,
            id: String(pr.number),
            status: await this.determineStatus(repo, pr),
            repository: {
              href: repo.html_url,
              name: repo.name,
            },
            commentCounter: await this.countComments(repo, pr),
            author: {
              href: pr.user!.html_url,
              name: pr.user!.login,
              avatarSrc: pr.user!.avatar_url,
            },
            teams: teams.map((team) => team.name),
          }),
        );
      }),
    );
  }

  private async loadPulls(): Promise<GitHubRepoPullRequest[]> {
    const repos = await this.getRepositories();
    const items = await Promise.all(
      repos.map(async (repo) => {
        const teams = await this.client.loadRepositoryTeams(repo);
        const pulls = await this.client.loadPullRequests(repo);
        return { repo, pulls, teams };
      }),
    );
    return items.flat();
  }

  private async getRepositories(): Promise<GitHubRepo[]> {
    const ONE_HOUR = 1000 * 60 * 60;
    if (
      !this.cachedRepos ||
      !this.lastReposUpdate ||
      Date.now() - this.lastReposUpdate > ONE_HOUR
    ) {
      this.cachedRepos = await this.client.loadRepositories(this.org);
      this.lastReposUpdate = Date.now();
    }
    return this.cachedRepos;
  }

  private async determineStatus(repository: GitHubRepo, pr: GitHubPullRequest): Promise<Status> {
    if (!pr.requested_reviewers) {
      return Status.OPEN;
    }

    const reviews = await this.client.loadReviews(repository, pr);
    if (!reviews.length) {
      return Status.IN_REVIEW;
    }

    const grouped = [...GithubGateway.groupReviews(reviews).values()];

    if (grouped.some((review) => review.state === 'CHANGES_REQUESTED')) {
      return Status.CHANGES_REQUESTED;
    }

    if (grouped.some((review) => review.state === 'APPROVED')) {
      return Status.APPROVED;
    }

    return Status.IN_REVIEW;
  }

  private async countComments(repository: GitHubRepo, pr: GitHubPullRequest): Promise<number> {
    const comments = await this.client.loadPullRequestReviewComments(repository, pr);
    const issueComments = await this.client.loadPullRequestComments(repository, pr);
    return comments.length + issueComments.length;
  }
}
