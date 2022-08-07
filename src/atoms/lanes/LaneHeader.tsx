import { ReactNode } from 'react';
import './LaneHeader.css';

interface Props {
  children: ReactNode;
}

export function LaneHeader({ children }: Props) {
  return <div className="LaneHeader">{children}</div>;
}
