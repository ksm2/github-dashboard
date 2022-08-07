import { ReactNode } from 'react';
import { ExtLink } from '~/atoms/ExtLink.js';
import './Card.css';

interface Props {
  href: string;
  children: ReactNode;
}

export function Card({ href, children }: Props) {
  return (
    <ExtLink tagName="div" href={href} className="Card">
      {children}
    </ExtLink>
  );
}
