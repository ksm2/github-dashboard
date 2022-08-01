import { Repository } from './Repository.js';
import { PullRequest } from './PullRequest.js';

export interface PullRequestService {
  loadRepositories(org: string): Promise<Repository[]>;
  loadPullRequests(org: string, repository: Repository): Promise<PullRequest[]>;
}
