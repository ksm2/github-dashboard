import { PullRequest } from './PullRequest.js';

export interface PullRequestService {
  loadPullRequests(): Promise<PullRequest[]>;
}
