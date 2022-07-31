import fastify from 'fastify';
import * as uuid from 'uuid';
import { FilterablePullRequest } from '~/model/FilterablePullRequest.js';
import { PullRequest } from '~/model/PullRequest.js';
import * as env from './env.js';
import { GithubClient } from './github/GithubClient.js';
import { GithubGateway } from './github/GithubGateway.js';
import { Condition, FilterConfig } from './model/FilterConfig.js';
import { PullRequestService } from './model/PullRequestService.js';

type Filter = FilterConfig & { id: string };

const app = fastify({ logger: true });
const prSvc: PullRequestService = new GithubGateway(
  new GithubClient(env.GITHUB_TOKEN),
  env.GITHUB_ORG,
);

const filters = env.FILTERS.map((cfg): Filter => ({ ...cfg, id: uuid.v4() }));

app.get('/filters', async (req, res) => {
  res.send(filters.map(({ id, name }) => ({ id, name })));
});

app.get('/pull-requests', async (req, res) => {
  const pullRequests = await prSvc.loadPullRequests();
  const pullRequestsWithFilters = pullRequests.map((pr): FilterablePullRequest => {
    const f = filters.filter((filter) => appliesToPullRequest(filter, pr)).map((f) => f.id);
    return { ...pr, filters: f };
  });

  res.send(pullRequestsWithFilters);
});

try {
  await app.listen({ port: env.HTTP_PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

function appliesToPullRequest(filter: FilterConfig, pr: PullRequest): boolean {
  let applies = true;
  if (filter.query.team) {
    applies = matchesCondition(filter.query.team, pr.teams);
  }

  return applies;
}

function matchesCondition<T>(condition: Condition<T>, values: T[]): boolean {
  return values.some((value) => matchCondition(condition, value));
}

function matchCondition<T>(condition: Condition<T>, value: T): boolean {
  let applies = true;
  if (condition.$eq !== undefined) {
    applies = value === condition.$eq;
  }
  return applies;
}
