import { graphql } from '@octokit/graphql';
import { Repository } from '~/model/Repository.js';
import { GitHubLabel, GitHubPullRequest, GitHubReview } from './types.js';

interface LoadReposQuery {
  organization: {
    repositories: Connection<LoadReposRepository>;
  };
}

interface LoadTeamsQuery {
  organization: {
    teams: Connection<LoadReposTeam>;
  };
}

interface LoadPullRequestsQuery {
  repository: {
    pullRequests: Connection<LoadPullRequestsPullRequests>;
  };
}

interface LoadReposTeam {
  name: string;
  repositories: Connection<{ id: string }>;
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
  labels: Connection<{ name: string; color: string }>;
  reviewRequests: Connection<{ requestedReviewer: { login?: string } }>;
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
  edges: {
    cursor: string;
  };
  nodes: T[];
  pageInfo: PageInfo;
}

interface PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export class GithubClient {
  private readonly graphql: typeof graphql;

  constructor(auth: string) {
    this.graphql = graphql.defaults({ headers: { authorization: `token ${auth}` } });
  }

  async loadRepositories(org: string): Promise<Repository[]> {
    const [repositories, teams] = await Promise.all([
      this.loadRepositoryPages(org),
      this.loadTeamPages(org),
    ]);

    const map = new Map<string, Repository>();
    for (const repository of repositories) {
      map.set(repository.id, {
        id: repository.id,
        name: repository.name,
        href: repository.url,
        teams: [],
      });
    }

    for (const team of teams) {
      for (const teamRepo of team.repositories.nodes) {
        if (map.has(teamRepo.id)) {
          map.get(teamRepo.id)!.teams.push(team.name);
        }
      }
    }

    return [...map.values()];
  }

  async loadRepositoryPages(org: string): Promise<LoadReposRepository[]> {
    return GithubClient.paginate(org, (org, cursor) => this.loadRepositoryPage(org, cursor));
  }

  async loadRepositoryPage(
    org: string,
    cursor: string | null = null,
  ): Promise<[LoadReposRepository[], PageInfo]> {
    const query = `
      query LoadRepos($org: String!, $cursor: String) {
        organization(login: $org) {
          repositories(first: 100, after: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              id 
              name
              url
            }
          }
        }
      }
    `;
    const { organization } = await this.graphql<LoadReposQuery>(query, { org, cursor });
    return [organization.repositories.nodes, organization.repositories.pageInfo];
  }

  async loadTeamPages(org: string): Promise<LoadReposTeam[]> {
    return GithubClient.paginate(org, (org, cursor) => this.loadTeamPage(org, cursor));
  }

  async loadTeamPage(
    org: string,
    cursor: string | null = null,
  ): Promise<[LoadReposTeam[], PageInfo]> {
    const query = `
      query LoadTeams($org: String!, $cursor: String) {
        organization(login: $org) {
          teams(first: 50, after: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              name
              repositories(first: 50) {
                nodes {
                  id 
                  url
                }
              }            
            }
          }
        }
      }
    `;
    const { organization } = await this.graphql<LoadTeamsQuery>(query, { org, cursor });
    return [organization.teams.nodes, organization.teams.pageInfo];
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
                  nodes {
                    requestedReviewer {
                      ... on User {
                        login
                      }
                    }
                  }
                }
                labels(first: 100) {
                  nodes {
                    name
                    color
                  }
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
        reviewRequests: pr.reviewRequests.nodes
          .map((request) => request.requestedReviewer.login)
          .filter(GithubClient.isString),
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
        labels: pr.labels.nodes.map(
          (label): GitHubLabel => ({
            name: label.name,
            color: label.color,
          }),
        ),
      }),
    );
  }

  private static async paginate<P, T>(
    param: P,
    callback: (param: P, cursor?: string) => Promise<[T[], PageInfo]>,
  ): Promise<T[]> {
    const allItems = [];
    let items = [];
    let hasNextPage = true;
    let endCursor = undefined;
    while (hasNextPage) {
      [items, { hasNextPage, endCursor }] = await callback(param, endCursor);
      allItems.push(...items);
    }

    return allItems;
  }

  private static isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
