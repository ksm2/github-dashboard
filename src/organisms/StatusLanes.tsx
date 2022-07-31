import { Lanes } from '~/atoms/lanes/Lanes.js';
import { Status } from '~/model/Status.js';
import { PullRequestLane } from '~/organisms/PullRequestLane.js';
import { useGetPullRequestsQuery } from '~/redux/apiSlice.js';
import { useAppSelector } from '~/redux/store.js';
import { intersects } from '~/utils/intersects.js';

export function StatusLanes() {
  const filters = useAppSelector((state) => state.filter.enabled);
  const { data: pullRequests = [] } = useGetPullRequestsQuery(undefined, { refetchOnFocus: true });
  const filteredPullRequests = pullRequests.filter(
    (pr) => !filters.length || intersects(pr.filters, filters),
  );

  return (
    <Lanes>
      <PullRequestLane status={Status.OPEN} pullRequests={filteredPullRequests} />
      <PullRequestLane status={Status.IN_REVIEW} pullRequests={filteredPullRequests} />
      <PullRequestLane status={Status.CHANGES_REQUESTED} pullRequests={filteredPullRequests} />
      <PullRequestLane status={Status.APPROVED} pullRequests={filteredPullRequests} />
    </Lanes>
  );
}
