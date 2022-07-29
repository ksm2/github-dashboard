import classNames from 'classnames';
import { ReactNode } from 'react';
import './Pill.css';

interface Props {
  onClick?: () => void;
  selected?: boolean;
  children: ReactNode;
}

export function Pill({ onClick, selected = false, children }: Props) {
  return (
    <button className={classNames('Pill', { selected })} onClick={onClick}>
      {children}
    </button>
  );
}
