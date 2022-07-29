import { ReactNode } from 'react';
import './Id.css';

interface Props {
  children: ReactNode;
}

export function Id({ children }: Props) {
  return <span className="Id">{children}</span>;
}
