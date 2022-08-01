export interface GitHubPullRequest {
  id: string;
  number: number;
  title: string;
  href: string;
  author: GitHubUser;
  reviews: GitHubReview[];
  reviewRequestCount: number;
  commentCount: number;
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
