import { ReactNode } from 'react';
import { CommentIcon } from '~/icons/CommentIcon.js';
import './CommentCounter.css';

interface Props {
  children: ReactNode;
}

export function CommentCounter({ children }: Props) {
  return (
    <div className="CommentCounter">
      <CommentIcon />
      {children}
    </div>
  );
}
