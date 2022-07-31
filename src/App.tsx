import { Counter } from '~/atoms/Counter.js';
import { Logo } from '~/atoms/Logo.js';
import { Separator } from '~/atoms/Separator.js';
import { Toolbar } from '~/atoms/Toolbar.js';
import { useDocumentTitle } from '~/hooks/useDocumentTitle.js';
import { FilterMenu } from '~/organisms/FilterMenu.js';
import { StatusLanes } from '~/organisms/StatusLanes.js';
import { useGetPullRequestsQuery } from '~/redux/apiSlice.js';
import { useAppSelector } from '~/redux/store.js';
import { intersects } from '~/utils/intersects.js';
import './App.css';

export function App() {
  const filters = useAppSelector((state) => state.filter.enabled);
  const { data: pullRequests = [] } = useGetPullRequestsQuery(undefined, { refetchOnFocus: true });
  const filteredPullRequests = pullRequests.filter(
    (pr) => !filters.length || intersects(pr.filters, filters),
  );

  const siteTitle = `Pull Requests`;
  const title = filteredPullRequests.length
    ? `(${filteredPullRequests.length}) ${siteTitle}`
    : siteTitle;

  useDocumentTitle(title);

  return (
    <div className="App">
      <Toolbar>
        <Logo />
        <h1>{siteTitle}</h1>
        <Counter number={filteredPullRequests.length} />
        <Separator />
        <FilterMenu />
      </Toolbar>
      <StatusLanes pullRequests={filteredPullRequests} />
    </div>
  );
}
