import { Octokit } from '@octokit/rest';
import { GitHubComment, GitHubPullRequest, GitHubRepo, GitHubReview, GitHubTeam } from './types.js';

export class GithubClient {
  private readonly octokit: Octokit;

  constructor(auth: string) {
    this.octokit = new Octokit({ auth });
  }

  async loadRepositories(org: string): Promise<GitHubRepo[]> {
    const response = await this.octokit.rest.repos.listForOrg({ org });
    return response.data;
  }

  async loadRepositoryTeams(repo: GitHubRepo): Promise<GitHubTeam[]> {
    try {
      const owner = repo.owner.login;
      const response = await this.octokit.rest.repos.listTeams({ owner, repo: repo.name });
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async loadPullRequests(repo: GitHubRepo): Promise<GitHubPullRequest[]> {
    const owner = repo.owner.login;
    const response = await this.octokit.rest.pulls.list({ owner, repo: repo.name });
    return response.data;
  }

  async loadPullRequestReviewComments(
    repository: GitHubRepo,
    pr: GitHubPullRequest,
  ): Promise<GitHubComment[]> {
    const owner = repository.owner.login;
    const repo = repository.name;
    const pull_number = pr.number;
    const response = await this.octokit.rest.pulls.listReviewComments({ owner, repo, pull_number });
    return response.data;
  }

  async loadPullRequestComments(repository: GitHubRepo, pr: GitHubPullRequest): Promise<unknown[]> {
    const owner = repository.owner.login;
    const repo = repository.name;
    const issue_number = pr.number;
    const response = await this.octokit.rest.issues.listComments({ owner, repo, issue_number });
    return response.data;
  }

  async loadReviews(repository: GitHubRepo, pr: GitHubPullRequest): Promise<GitHubReview[]> {
    const owner = repository.owner.login;
    const repo = repository.name;
    const pull_number = pr.number;
    const response = await this.octokit.rest.pulls.listReviews({ owner, repo, pull_number });
    return response.data;
  }
}
