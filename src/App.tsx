import { useEffect, useState } from 'react';
import './App.css';
import { useOctokit } from './OctokitProvider.js';

interface Repo {
  name: string;
  html_url: string;
}

function App() {
  const octokit = useOctokit();
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    octokit.rest.repos
      .listForOrg({ org: import.meta.env.GITHUB_ORGA })
      .then(({ data }) => data)
      .then((repos) => {
        setRepos(repos);
        repos.forEach((repo) => {
          octokit.rest.pulls
            .list({ owner: repo.owner.login, repo: repo.name })
            .then(({ data }) => console.log(data));
        });
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello PRs!</p>
        <ul>
          {repos.map((repo) => (
            <li key={repo.name}>
              <a href={repo.html_url}>{repo.name}</a>
            </li>
          ))}
        </ul>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
