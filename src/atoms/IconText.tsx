import { ReactNode } from 'react';
import './IconText.css';

interface Props {
  icon: ReactNode;
  title?: string;
  children: ReactNode;
}

export function IconText({ icon, title, children }: Props) {
  return (
    <div className="IconText" title={title}>
      {icon}
      {children}
    </div>
  );
}
