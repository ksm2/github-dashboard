import { ReactNode } from 'react';
import './Lanes.css';

interface Props {
  children: ReactNode;
}

export function Lanes({ children }: Props) {
  return <div className="Lanes">{children}</div>;
}
