import classNames from 'classnames';
import { ReactNode } from 'react';

export interface IconProps {
  className?: string;
}

interface Props extends IconProps {
  children: ReactNode;
}

export function Icon({ className, children }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('icon', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {children}
    </svg>
  );
}
