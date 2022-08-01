import express from 'express';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as uuid from 'uuid';
import { Logger } from './Logger.js';
import * as env from './env.js';
import { GithubClient } from './github/GithubClient.js';
import { GithubGateway } from './github/GithubGateway.js';
import { FilterablePullRequest } from './model/FilterablePullRequest.js';
import { Condition, FilterConfig } from './model/FilterConfig.js';
import { PullRequestService } from './model/PullRequestService.js';
import { Repository } from './model/Repository.js';
import { RepositoryStorage } from './RepositoryStorage.js';

type Filter = FilterConfig & { id: string };

const app = express();
const logger = new Logger();
const prSvc: PullRequestService = new GithubGateway(
  new GithubClient(env.GITHUB_TOKEN),
  env.GITHUB_ORG,
);
const repositoryStorage = new RepositoryStorage(env.GITHUB_ORG, logger, prSvc);

const filters = env.FILTERS.map((cfg): Filter => ({ ...cfg, id: uuid.v4() }));

const dirName = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(dirName, '../dist/')));

app.get('/', async (req, res) => {
  return res.sendFile('index.html', path.join(dirName, '../dist/'));
});

app.get('/api/filters', async (req, res) => {
  res.send(filters.map(({ id, name }) => ({ id, name })));
});

app.get('/api/pull-requests', async (req, res) => {
  const repositories = await repositoryStorage.loadRepositories();

  const allPullRequests: FilterablePullRequest[] = [];
  for (const repository of repositories) {
    const pullRequests = await prSvc.loadPullRequests(env.GITHUB_ORG, repository);
    for (const pullRequest of pullRequests) {
      const f = filters
        .filter((filter) => appliesToPullRequest(filter, repository))
        .map((f) => f.id);

      allPullRequests.push({ ...pullRequest, filters: f });
    }
  }

  res.send(allPullRequests);
});

app.listen(env.HTTP_PORT, () => {
  logger.info(`Listening on http://0.0.0.0:${env.HTTP_PORT}`);
});

function appliesToPullRequest(filter: FilterConfig, repository: Repository): boolean {
  let applies = true;
  if (filter.query.team) {
    applies = matchesCondition(filter.query.team, repository.teams);
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
