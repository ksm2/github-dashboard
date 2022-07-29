import { ReactNode } from 'react';
import './CardHeader.css';

interface Props {
  children: ReactNode;
}

export function CardHeader({ children }: Props) {
  return <div className="CardHeader">{children}</div>;
}
