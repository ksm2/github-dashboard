import { ReactNode } from 'react';
import './PillMenu.css';

interface Props {
  children: ReactNode;
}

export function PillMenu({ children }: Props) {
  return <div className="PillMenu">{children}</div>;
}
