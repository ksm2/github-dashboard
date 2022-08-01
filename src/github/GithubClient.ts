import { graphql } from '@octokit/graphql';
import { Repository } from '~/model/Repository.js';
import { GitHubPullRequest, GitHubReview } from './types.js';

interface LoadReposQuery {
  organization: {
    repositories: Connection<LoadReposRepository>;
    teams: Connection<{
      name: string;
      repositories: Connection<{ id: string }>;
    }>;
  };
}

interface LoadPullRequestsQuery {
  repository: {
    pullRequests: Connection<LoadPullRequestsPullRequests>;
  };
}

interface LoadReposRepository {
  id: string;
  name: string;
  url: string;
}

interface LoadPullRequestsPullRequests {
  id: string;
  number: number;
  title: string;
  url: string;
  author: {
    login: string;
    url: string;
    avatarUrl: string;
  };
  reviewRequests: {
    totalCount: number;
  };
  comments: {
    totalCount: number;
  };
  reviews: Connection<LoadPullRequestsReview>;
}

interface LoadPullRequestsReview {
  state: string;
  submittedAt: string;
  author: {
    login: string;
  };
  comments: {
    totalCount: number;
  };
}

interface Connection<T> {
  nodes: T[];
}

export class GithubClient {
  private readonly graphql: typeof graphql;

  constructor(auth: string) {
    this.graphql = graphql.defaults({ headers: { authorization: `token ${auth}` } });
  }

  async loadRepositories(org: string): Promise<Repository[]> {
    const { organization } = await this.graphql<LoadReposQuery>(
      `
        query LoadRepos($org: String!) {
          organization(login: $org) {
            repositories(first: 100) {
              nodes {
                id 
                name
                url
              }
            }
            teams(first: 20) {
              nodes {
                name
                repositories(first: 20) {
                  nodes {
                    id 
                  }
                }            
              }
            }
          }
        }
      `,
      { org },
    );

    const { teams, repositories } = organization;
    const map = new Map<string, Repository>();
    for (const repository of repositories.nodes) {
      map.set(repository.id, {
        id: repository.id,
        name: repository.name,
        href: repository.url,
        teams: [],
      });
    }

    for (const team of teams.nodes) {
      for (const teamRepo of team.repositories.nodes) {
        map.get(teamRepo.id)!.teams.push(team.name);
      }
    }

    return [...map.values()];
  }

  async loadPullRequests(org: string, repoName: string): Promise<GitHubPullRequest[]> {
    const { repository } = await this.graphql<LoadPullRequestsQuery>(
      `
        query LoadPullRequests($org: String!, $repoName: String!) {
          repository(owner: $org, name: $repoName) {
            pullRequests(first: 20, states: OPEN) {
              nodes {
                id
                number
                title
                url
                author {
                  login
                  url
                  avatarUrl                
                }
                comments {
                  totalCount
                }
                reviewRequests(first: 20) {
                  totalCount
                }
                reviews(first: 20) {
                  nodes {
                    state
                    submittedAt
                    author {
                      login
                    }
                    comments {
                      totalCount
                    }                
                  }
                }
              }
            }
          }
        }
      `,
      { org, repoName },
    );

    const pullRequests = repository.pullRequests.nodes;
    return pullRequests.map(
      (pr): GitHubPullRequest => ({
        id: pr.id,
        href: pr.url,
        number: pr.number,
        title: pr.title,
        commentCount: pr.comments.totalCount,
        reviewRequestCount: pr.reviewRequests.totalCount,
        author: {
          login: pr.author.login,
          url: pr.author.url,
          avatarUrl: pr.author.avatarUrl,
        },
        reviews: pr.reviews.nodes.map(
          (review): GitHubReview => ({
            state: review.state,
            commentCount: review.comments.totalCount,
            author: review.author.login,
            submittedAt: new Date(review.submittedAt),
          }),
        ),
      }),
    );
  }
}
