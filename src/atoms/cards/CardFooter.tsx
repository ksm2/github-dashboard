import { ReactNode } from 'react';
import './CardFooter.css';

interface Props {
  children: ReactNode;
}

export function CardFooter({ children }: Props) {
  return <div className="CardFooter">{children}</div>;
}
