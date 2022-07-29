import { Lanes } from '~/atoms/lanes/Lanes.js';
import { Logo } from '~/atoms/Logo.js';
import { Pill } from '~/atoms/pills/Pill.js';
import { PillMenu } from '~/atoms/pills/PillMenu.js';
import { Separator } from '~/atoms/Separator.js';
import { Toolbar } from '~/atoms/Toolbar.js';
import { pullRequests } from '~/fixtures.js';
import { Status } from '~/model/Status.js';
import { PullRequestLane } from '~/organisms/PullRequestLane.js';
import './App.css';

export function App() {
  return (
    <div className="App">
      <Toolbar>
        <Logo />
        <h1>Pull Requests</h1>
        <Separator />
        <PillMenu>
          <Pill>Filter 1</Pill>
          <Pill selected>Filter 2</Pill>
        </PillMenu>
      </Toolbar>
      <Lanes>
        <PullRequestLane status={Status.OPEN} pullRequests={pullRequests} />
        <PullRequestLane status={Status.IN_REVIEW} pullRequests={pullRequests} />
        <PullRequestLane status={Status.CHANGES_REQUESTED} pullRequests={pullRequests} />
        <PullRequestLane status={Status.APPROVED} pullRequests={pullRequests} />
      </Lanes>
    </div>
  );
}
