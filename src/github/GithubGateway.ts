import { Repository } from '~/model/Repository.js';
import { PullRequest } from '../model/PullRequest.js';
import { PullRequestService } from '../model/PullRequestService.js';
import { Status } from '../model/Status.js';
import { groupBy } from '../utils/groupBy.js';
import { GithubClient } from './GithubClient.js';
import { GitHubPullRequest, GitHubReview } from './types.js';

export class GithubGateway implements PullRequestService {
  private static readonly STATE_CHANGES = 'CHANGES_REQUESTED';
  private static readonly STATE_APPROVED = 'APPROVED';

  private readonly client: GithubClient;
  private readonly org: string;

  constructor(client: GithubClient, org: string) {
    this.client = client;
    this.org = org;
  }

  async loadRepositories(org: string): Promise<Repository[]> {
    return this.client.loadRepositories(org);
  }

  async loadPullRequests(org: string, repository: Repository): Promise<PullRequest[]> {
    const pullRequests = await this.client.loadPullRequests(org, repository.name);

    return pullRequests.map(
      (pullRequest): PullRequest => ({
        id: String(pullRequest.number),
        title: pullRequest.title,
        author: {
          name: pullRequest.author.login,
          href: pullRequest.author.url,
          avatarSrc: pullRequest.author.avatarUrl,
        },
        href: pullRequest.href,
        approvalCount: this.countApprovals(pullRequest),
        commentCount: this.countComments(pullRequest),
        repository,
        status: this.determineStatus(pullRequest),
        labels: pullRequest.labels,
      }),
    );
  }

  private countApprovals(pr: GitHubPullRequest): number {
    if (!pr.reviews.length) {
      return 0;
    }

    const reviewMap = GithubGateway.groupReviews(pr.reviews);
    for (const reviewRequest of pr.reviewRequests) {
      reviewMap.delete(reviewRequest);
    }

    return [...reviewMap.values()].reduce(
      (sum, review) => (review.state === GithubGateway.STATE_APPROVED ? sum + 1 : sum),
      0,
    );
  }

  private countComments(pullRequest: GitHubPullRequest): number {
    return pullRequest.reviews.reduce(
      (count, review) => count + review.commentCount,
      pullRequest.commentCount,
    );
  }

  private determineStatus(pr: GitHubPullRequest): Status {
    if (!pr.reviews.length) {
      return pr.reviewRequests.length ? Status.IN_REVIEW : Status.OPEN;
    }

    const reviewMap = GithubGateway.groupReviews(pr.reviews);
    for (const reviewRequest of pr.reviewRequests) {
      reviewMap.delete(reviewRequest);
    }

    const grouped = [...reviewMap.values()];
    if (grouped.some((review) => review.state === GithubGateway.STATE_CHANGES)) {
      return Status.CHANGES_REQUESTED;
    }

    if (grouped.some((review) => review.state === GithubGateway.STATE_APPROVED)) {
      return Status.APPROVED;
    }

    return Status.IN_REVIEW;
  }

  private static groupReviews(reviews: GitHubReview[]): Map<string, GitHubReview> {
    return groupBy(
      reviews.filter((review) =>
        [GithubGateway.STATE_APPROVED, GithubGateway.STATE_CHANGES].includes(review.state),
      ),
      (r) => r.author,
      (r1, r2) => r2.submittedAt.getTime() - r1.submittedAt.getTime(),
    );
  }
}
