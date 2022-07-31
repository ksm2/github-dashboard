import { Logo } from '~/atoms/Logo.js';
import { Separator } from '~/atoms/Separator.js';
import { Toolbar } from '~/atoms/Toolbar.js';
import { FilterMenu } from '~/organisms/FilterMenu.js';
import { StatusLanes } from '~/organisms/StatusLanes.js';
import './App.css';

export function App() {
  return (
    <div className="App">
      <Toolbar>
        <Logo />
        <h1>Pull Requests</h1>
        <Separator />
        <FilterMenu />
      </Toolbar>
      <StatusLanes />
    </div>
  );
}
