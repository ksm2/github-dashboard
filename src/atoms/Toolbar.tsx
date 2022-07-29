import { ReactNode } from 'react';
import './Toolbar.css';

interface Props {
  children: ReactNode;
}

export function Toolbar({ children }: Props) {
  return <div className="Toolbar">{children}</div>;
}
