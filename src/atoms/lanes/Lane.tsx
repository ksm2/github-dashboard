import { ReactNode } from 'react';
import './Lane.css';

interface Props {
  children: ReactNode;
}

export function Lane({ children }: Props) {
  return <div className="Lane">{children}</div>;
}
