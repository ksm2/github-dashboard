import express from 'express';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as uuid from 'uuid';
import * as env from './env.js';
import { GithubClient } from './github/GithubClient.js';
import { GithubGateway } from './github/GithubGateway.js';
import { Logger } from './Logger.js';
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

const filters: Filter[] = [];
if (env.FILTERS) {
  const filterConfigJson = await fs.readFile(env.FILTERS, 'utf8');
  const filterConfig = JSON.parse(filterConfigJson) as FilterConfig[];
  filters.push(...filterConfig.map((cfg): Filter => ({ ...cfg, id: uuid.v4() })));
}
logger.info(`Loaded filters: [${filters.map((f) => f.name).join(', ')}]`);

const dirName = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(dirName, '../dist/')));

app.get('/', async (req, res) => {
  return res.sendFile('index.html', path.join(dirName, '../dist/'));
});

app.get('/api/filters', async (req, res) => {
  res.send(filters.map(({ id, name }) => ({ id, name })));
});

app.get('/api/pull-requests', async (req, res) => {
  try {
    const repositories = await repositoryStorage.loadRepositories();
    const filteredRepos = repositories.filter((repo) =>
      filters.some((filter) => appliesToRepository(filter, repo)),
    );

    const allPullRequests: FilterablePullRequest[] = [];
    await Promise.all(
      filteredRepos.map(async (repository) => {
        const pullRequests = await prSvc.loadPullRequests(env.GITHUB_ORG, repository);
        for (const pullRequest of pullRequests) {
          const f = filters
            .filter((filter) => appliesToRepository(filter, repository))
            .map((f) => f.id);

          allPullRequests.push({ ...pullRequest, filters: f });
        }
      }),
    );

    res.send(allPullRequests);
  } catch (reason: unknown) {
    const err = reason as Error;
    logger.error(err.stack!);
    res.status(500).send({ error: err.message });
  }
});

app.listen(env.HTTP_PORT, () => {
  logger.info(`Listening on http://0.0.0.0:${env.HTTP_PORT}`);
});

function appliesToRepository(filter: FilterConfig, repository: Repository): boolean {
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
