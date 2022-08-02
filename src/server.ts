import express from 'express';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as env from './env.js';
import { GithubClient } from './github/GithubClient.js';
import { GithubGateway } from './github/GithubGateway.js';
import { Logger } from './Logger.js';
import { FilterConfig, FilterConfigJson } from './model/FilterConfig.js';
import { PullRequestService } from './model/PullRequestService.js';
import { PullRequestLoader } from './PullRequestLoader.js';
import { PullRequestStorage } from './PullRequestStorage.js';
import { RepositoryStorage } from './RepositoryStorage.js';

const app = express();
const logger = new Logger();

const filters: FilterConfig[] = [];
if (env.FILTERS) {
  const filterConfigJson = await fs.readFile(env.FILTERS, 'utf8');
  const filterConfig = JSON.parse(filterConfigJson) as FilterConfigJson[];
  filters.push(...filterConfig.map(FilterConfig.fromJSON));
}
logger.info(`Loaded filters: [${filters.map((f) => f.name).join(', ')}]`);

const githubClient = new GithubClient(env.GITHUB_TOKEN);
const pullRequestService: PullRequestService = new GithubGateway(githubClient, env.GITHUB_ORG);
const repositoryStorage = new RepositoryStorage(env.GITHUB_ORG, logger, pullRequestService);
const pullRequestLoader = new PullRequestLoader(env.GITHUB_ORG, filters, pullRequestService);
const pullRequestStorage = new PullRequestStorage(logger, repositoryStorage, pullRequestLoader);

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
    const allPullRequests = await pullRequestStorage.loadPullRequests();
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
