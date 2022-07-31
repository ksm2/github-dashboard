import fastify from 'fastify';
import * as env from './env.js';
import { filters } from './fixtures.js';
import { GithubClient } from './github/GithubClient.js';
import { GithubGateway } from './github/GithubGateway.js';
import { PullRequestService } from './model/PullRequestService.js';

const app = fastify({ logger: true });
const prSvc: PullRequestService = new GithubGateway(
  new GithubClient(env.GITHUB_TOKEN),
  env.GITHUB_ORGA,
);

app.get('/filters', async (req, res) => {
  res.send(filters);
});

app.get('/pull-requests', async (req, res) => {
  const pullRequests = await prSvc.loadPullRequests();

  res.send(pullRequests);
});

try {
  await app.listen({ port: env.HTTP_PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
