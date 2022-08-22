import { ReactNode } from 'react';
import './Tags.css';

interface Props {
  children: ReactNode;
}

export function Tags({ children }: Props) {
  return <div className="Tags">{children}</div>;
}
