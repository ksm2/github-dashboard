import { ReactNode } from 'react';
import './LaneColumn.css';

interface Props {
  children: ReactNode;
}

export function LaneColumn({ children }: Props) {
  return <div className="LaneColumn">{children}</div>;
}
