import { ReactNode } from 'react';

interface Props {
  className?: string;
  title?: string;
  href: string;
  children: ReactNode;
}

export function ExtLink({ children, ...pros }: Props) {
  return (
    <a target="_blank" rel="nofollow noopener" {...pros}>
      {children}
    </a>
  );
}
