import { Lanes } from '~/atoms/lanes/Lanes.js';
import { PullRequest } from '~/model/PullRequest.js';
import { Status } from '~/model/Status.js';
import { PullRequestLane } from '~/organisms/PullRequestLane.js';

interface Props {
  pullRequests: PullRequest[];
}

export function StatusLanes({ pullRequests }: Props) {
  return (
    <Lanes>
      <PullRequestLane status={Status.DRAFT} pullRequests={pullRequests} />
      <PullRequestLane status={Status.OPEN} pullRequests={pullRequests} />
      <PullRequestLane status={Status.IN_REVIEW} pullRequests={pullRequests} />
      <PullRequestLane status={Status.CHANGES_REQUESTED} pullRequests={pullRequests} />
      <PullRequestLane status={Status.APPROVED} pullRequests={pullRequests} />
    </Lanes>
  );
}
