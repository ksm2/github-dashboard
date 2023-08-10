import { CheckStatus } from '~/model/CheckStatus.js';

export interface GitHubPullRequest {
  id: string;
  number: number;
  title: string;
  href: string;
  draft: boolean;
  checkStatus: CheckStatus;
  author: GitHubUser;
  reviews: GitHubReview[];
  reviewRequests: string[];
  commentCount: number;
  labels: GitHubLabel[];
}

export interface GitHubUser {
  login: string;
  url: string;
  avatarUrl: string;
}

export interface GitHubReview {
  state: string;
  submittedAt: Date;
  author: string;
  commentCount: number;
}

export interface GitHubLabel {
  name: string;
  color: string;
}
