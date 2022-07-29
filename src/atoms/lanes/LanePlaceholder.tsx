import { ReactNode } from 'react';
import './LanePlaceholder.css';

interface Props {
  icon: ReactNode;
  children: ReactNode;
}

export function LanePlaceholder({ icon, children }: Props) {
  return (
    <div className="LanePlaceholder">
      {icon}
      <p>{children}</p>
    </div>
  );
}
