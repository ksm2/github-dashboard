import { RestEndpointMethodTypes } from '@octokit/rest';

export type GitHubRepo = RestEndpointMethodTypes['repos']['listForOrg']['response']['data'][0];
export type GitHubPullRequest = RestEndpointMethodTypes['pulls']['list']['response']['data'][0];
export type GitHubReview = RestEndpointMethodTypes['pulls']['listReviews']['response']['data'][0];
