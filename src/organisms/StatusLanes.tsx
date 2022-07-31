import { Lanes } from '~/atoms/lanes/Lanes.js';
import { Status } from '~/model/Status.js';
import { PullRequestLane } from '~/organisms/PullRequestLane.js';
import { useGetPullRequestsQuery } from '~/redux/apiSlice.js';

export function StatusLanes() {
  const { data: pullRequests = [] } = useGetPullRequestsQuery();

  return (
    <Lanes>
      <PullRequestLane status={Status.OPEN} pullRequests={pullRequests} />
      <PullRequestLane status={Status.IN_REVIEW} pullRequests={pullRequests} />
      <PullRequestLane status={Status.CHANGES_REQUESTED} pullRequests={pullRequests} />
      <PullRequestLane status={Status.APPROVED} pullRequests={pullRequests} />
    </Lanes>
  );
}
