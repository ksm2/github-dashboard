import { Lane } from '~/atoms/lanes/Lane.js';
import { PullRequest } from '~/model/PullRequest.js';
import { Status } from '~/model/Status.js';
import { StatusPlaceholder } from '~/molecules/StatusPlaceholder.js';
import { PullRequestCard } from '~/organisms/PullRequestCard.js';

interface Props {
  pullRequests: PullRequest[];
  status: Status;
}

export function PullRequestLane({ pullRequests, status }: Props) {
  const filteredPrs = pullRequests.filter((pr) => pr.status === status);

  if (!filteredPrs.length) {
    return (
      <Lane>
        <StatusPlaceholder status={status} />
      </Lane>
    );
  }

  return (
    <Lane>
      {filteredPrs.map((pr, index) => (
        <PullRequestCard key={index} pullRequest={pr} />
      ))}
    </Lane>
  );
}
