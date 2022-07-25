// @ts-ignore
import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';
import { Octokit as OctokitType } from '@octokit/rest';
import { createContext, ReactNode, useContext, useRef } from 'react';

interface Props {
  children: ReactNode;
}

const OctokitContext = createContext<OctokitType>(undefined!);

export const useOctokit = (): OctokitType => useContext(OctokitContext);

export function OctokitProvider({ children }: Props) {
  const octokit = useRef(new Octokit({ auth: import.meta.env.GITHUB_TOKEN }));

  return <OctokitContext.Provider value={octokit.current}>{children}</OctokitContext.Provider>;
}
